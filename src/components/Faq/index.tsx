import React from 'react';
import './style.scss';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';

export default class Faq extends React.Component {
  render() {
    return (
      <div className="faq">
        <ViewResolver sideLabel='More options'>
            <View main>
              <div className="typography-4">Faq</div>
            </View>
            <View side>
              <div className="filter-container">
                  <div className="section-main">
                    <div className="typography-4">Side bar</div>
                  </div>
              </div>
            </View>
        </ViewResolver>
      </div>
    );
  }
}