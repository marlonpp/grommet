// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var ReactIntl = require('react-intl');
var FormattedMessage = ReactIntl.FormattedMessage;

var CLASS_ROOT = "object";

var GrommetObject = React.createClass({

  propTypes: {
    data: React.PropTypes.object
  },

  _renderArray: function (array) {
    return array.map(function (item, index) {
      var itemContent = item;
      if ('object' === typeof(item)) {
        itemContent = this._renderObject(item);
      }
      return (
        <li key={'i_' + index} className="list-item">{itemContent}</li>
      );
    }, this);
  },

  _renderObject: function (obj) {
    var attrs = [];
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        var value = obj[name];
        var classes = [CLASS_ROOT + "__attribute"];
        if (null === value) {
          value = 'null';
          classes.push(CLASS_ROOT + "__attribute--unset");
        } else if (Array.isArray(value)) {
          var items = this._renderArray(value);
          value = (
            <ol>{items}</ol>
          );
          classes.push(CLASS_ROOT + "__attribute--array");
        } else if ('object' === typeof value) {
          value = this._renderObject(value);
          classes.push(CLASS_ROOT + "__attribute--container");
        } else {
          value = value.toString();
        }
        attrs.push(
          <li key={'n_' + name} className={classes.join(' ')}>
            <span className={CLASS_ROOT + "__attribute-name"}>
              <FormattedMessage id={name} defaultMessage={name} />
            </span>
            <span className={CLASS_ROOT + "__attribute-value"}>
              <FormattedMessage id={value} defaultMessage={value} />
            </span>
          </li>
        );
      }
    }

    return (
      <ul>{attrs}</ul>
    );
  },

  render: function() {
    return (
      <div className={CLASS_ROOT}>
        <div className={CLASS_ROOT + "__container"}>
          {this._renderObject(this.props.data)}
        </div>
      </div>
    );
  }

});

module.exports = GrommetObject;