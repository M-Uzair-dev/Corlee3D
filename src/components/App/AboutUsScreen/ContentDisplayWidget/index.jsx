import StoryDisplay from "../StoryDisplay";
import SectionRenderer from "../SectionRenderer";
import ImageContainer from "../ImageContainer";
import "./style.css";
import messages from "./messages.json";
import messages2 from "./messages2.json";

function ContentDisplayWidget({ possibleSectionTitles }) {
  const isMandarin = localStorage.getItem("isMandarin");
  return (
    <div className="vertical-centered-container">
      <div className="vertical-flex-container">
        <div className="hero-section">
          <div className="story-section-container">
            <StoryDisplay />
            <p className="narrative-text-style">
              {isMandarin
                ? messages2[
                    "lrem_ipsum_tis_kvasiposade_poment_vtirade_ding_eft"
                  ]
                : messages[
                    "lrem_ipsum_tis_kvasiposade_poment_vtirade_ding_eft"
                  ]}
            </p>
            <div className="statistic-cards-group">
              <div className="statistic-card">
                <p className="standout-text">27+</p>
                <p className="info-card-text-style">
                  {isMandarin
                    ? messages2["production_experience"]
                    : messages["production_experience"]}
                </p>
              </div>
              <div className="statistic-card">
                <p className="standout-text">600+</p>
                <p className="info-card-text-style">
                  {isMandarin
                    ? messages2["clients_worldwide"]
                    : messages["clients_worldwide"]}
                </p>
              </div>
              <div className="statistic-card">
                <p className="standout-text">4.9</p>
                <p className="info-card-text-style">
                  {isMandarin
                    ? messages2["stars_rating"]
                    : messages["stars_rating"]}
                </p>
              </div>
            </div>
          </div>
          <div className="vertical-section-container">
            <SectionRenderer possibleSectionTitles={possibleSectionTitles} />
            <ImageContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDisplayWidget;
