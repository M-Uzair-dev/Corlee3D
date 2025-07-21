export const FILTER_CONFIGS = {
  users: [
    { value: "name", label: "姓名" },
    { value: "company_name", label: "公司名稱" },
    { value: "address", label: "地址" },
    { value: "phone", label: "電話號碼" },
    { value: "mobile_phone", label: "手機號碼" },
    { value: "email", label: "信箱" }
  ],
  
  fabrics: [
    { value: "keyword", label: "關鍵字搜尋" },
    { value: "item_code", label: "商品編號" },
    { value: "title", label: "標題" },
    { value: "composition", label: "成分" },
    { value: "weight", label: "重量" },
    { value: "finish", label: "後加工" },
    { value: "category", label: "分類" }
  ]
};

export const getFilterConfig = (type) => {
  return FILTER_CONFIGS[type] || [];
};