import React, { useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import './RichTextEditor.css';

// Only register the module once
if (Quill && !Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize);
}

// Custom Blot to handle images with size attributes
const ImageBlot = Quill.import('formats/image');
class SizedImageBlot extends ImageBlot {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    } else {
      // If value contains width and height, set them
      if (value.width) {
        node.setAttribute('width', value.width);
      }
      if (value.height) {
        node.setAttribute('height', value.height);
      }
      node.setAttribute('src', value.src);
    }
    return node;
  }

  static value(node) {
    return {
      src: node.getAttribute('src'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}
SizedImageBlot.blotName = 'sizedImage';
SizedImageBlot.tagName = 'img';
Quill.register('formats/sizedImage', SizedImageBlot, true);

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
    imageResize: {
      modules: ['Resize', 'DisplaySize'],
      displayStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white'
      },
      handleStyles: {
        backgroundColor: '#4285f4',
        border: 'none',
        width: '8px',
        height: '8px'
      }
    },
    clipboard: {
      matchVisual: false,
      matchers: [
        ['img', (node, delta) => {
          const img = delta.ops[0].insert.image;
          if (typeof img === 'object' && img.src) {
            // Preserve width and height if they exist
            return delta.compose(new Delta().retain(delta.length(), {
              image: {
                src: img.src,
                width: node.getAttribute('width'),
                height: node.getAttribute('height')
              }
            }));
          }
          return delta;
        }]
      ]
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'sizedImage',
    'align'
  ];

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = async (e) => {
    const clipboard = e.clipboardData;
    if (clipboard && clipboard.items) {
      const items = clipboard.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          try {
            const dataUrl = await handleImageUpload(file);
            const editor = this.getEditor();
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, 'sizedImage', { src: dataUrl }, 'user');
            editor.setSelection(range.index + 1);
          } catch (error) {
            console.error('Error handling image paste:', error);
          }
        }
      }
    }
  };

  // Add a handler for the image-resize module's resize event
  useEffect(() => {
    const editor = document.querySelector('.ql-editor');
    if (editor) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const img = mutation.target;
            if (img.tagName === 'IMG') {
              // Update the width and height attributes when style changes
              const style = window.getComputedStyle(img);
              img.setAttribute('width', style.width);
              img.setAttribute('height', style.height);
            }
          }
        });
      });

      observer.observe(editor, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style']
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        onPaste={handlePaste}
      />
    </div>
  );
};

export default RichTextEditor; 