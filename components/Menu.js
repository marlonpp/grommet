// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var merge = require('lodash/object/merge');
var pick = require('lodash/object/pick');
var keys = require('lodash/object/keys');
var KeyboardAccelerators = require('../mixins/KeyboardAccelerators');
var Drop = require('../utils/Drop');
var Responsive = require('../utils/Responsive');
var Box = require('./Box');
var MoreIcon = require('./icons/More');
var DropCaretIcon = require('./icons/DropCaret');

var CLASS_ROOT = "menu";

// We have a separate module for the drop component so we can transfer the router context.
var MenuDrop = React.createClass({
  displayName: 'MenuDrop',

  propTypes: merge({
    control: React.PropTypes.node,
    dropAlign: Drop.alignPropType,
    dropColorIndex: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    large: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
    router: React.PropTypes.func,
    small: React.PropTypes.bool
  }, Box.propTypes),

  childContextTypes: {
    router: React.PropTypes.func
  },

  mixins: [KeyboardAccelerators],

  getChildContext: function getChildContext() {
    return { router: this.props.router };
  },

  componentDidMount: function componentDidMount() {
    this._keyboardHandlers = {
      up: this._onUpKeyPress,
      down: this._onDownKeyPress
    };
    this.startListeningToKeyboard(this._keyboardHandlers);
    var menuItems = this.refs.navContainer.getDOMNode().childNodes;
    for (var i = 0; i < menuItems.length; i++) {
      var classes = menuItems[i].className.toString();
      var tagName = menuItems[i].tagName.toLowerCase();
      // want to skip items of the menu that are not focusable.
      if (tagName !== 'button' && tagName !== 'a' && classes.indexOf('check-box') === -1) {
        continue;
      }
      menuItems[i].setAttribute('role', 'menuitem');

      if (!menuItems[i].getAttribute('id')) {
        menuItems[i].setAttribute('id', menuItems[i].getAttribute('data-reactid'));
      }
      // aria-selected informs AT which menu item is selected for that menu container.
      menuItems[i].setAttribute('aria-selected', classes.indexOf('active'));
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.stopListeningToKeyboard(this._keyboardHandlers);
  },

  _onUpKeyPress: function _onUpKeyPress(event) {
    event.preventDefault();
    var menuItems = this.refs.navContainer.getDOMNode().childNodes;
    if (!this.activeMenuItem) {
      var lastMenuItem = menuItems[menuItems.length - 1];
      this.activeMenuItem = lastMenuItem;
    } else if (this.activeMenuItem.previousSibling) {
      this.activeMenuItem = this.activeMenuItem.previousSibling;
    }

    var classes = this.activeMenuItem.className.split(/\s+/);
    var tagName = this.activeMenuItem.tagName.toLowerCase();
    // want to skip items of the menu that are not focusable.
    if (tagName !== 'button' && tagName !== 'a' && classes.indexOf('check-box') === -1) {
      if (this.activeMenuItem === menuItems[0]) {
        return true;
      } else {
        // If this item is not focusable, check the next item.
        return this._onUpKeyPress(event);
      }
    }

    this.activeMenuItem.focus();
    this.refs.menuDrop.getDOMNode().setAttribute('aria-activedescendant', this.activeMenuItem.getAttribute('id'));
    // Stops KeyboardAccelerators from calling the other listeners. Works limilar to event.stopPropagation().
    return true;
  },

  _onDownKeyPress: function _onDownKeyPress(event) {
    event.preventDefault();
    var menuItems = this.refs.navContainer.getDOMNode().childNodes;
    if (!this.activeMenuItem) {
      this.activeMenuItem = menuItems[0];
    } else if (this.activeMenuItem.nextSibling) {
      this.activeMenuItem = this.activeMenuItem.nextSibling;
    }

    var classes = this.activeMenuItem.className.split(/\s+/);
    var tagName = this.activeMenuItem.tagName.toLowerCase();
    // want to skip items of the menu that are not focusable.
    if (tagName !== 'button' && tagName !== 'a' && classes.indexOf('check-box') === -1) {
      if (this.activeMenuItem === menuItems[menuItems.length - 1]) {
        return true;
      } else {
        // If this item is not focusable, check the next item.
        return this._onDownKeyPress(event);
      }
    }

    this.activeMenuItem.focus();
    this.refs.menuDrop.getDOMNode().setAttribute('aria-activedescendant', this.activeMenuItem.getAttribute('id'));
    // Stops KeyboardAccelerators from calling the other listeners. Works limilar to event.stopPropagation().
    return true;
  },

  render: function render() {
    var classes = [CLASS_ROOT + "__drop"];
    var other = pick(this.props, keys(Box.propTypes));

    var first = this.props.control;
    var second = React.createElement(
      Box,
      _extends({ ref: 'navContainer', tag: 'nav' }, other),
      this.props.children
    );
    if (this.props.dropAlign.bottom) {
      first = second;
      second = this.props.control;
    }
    if (this.props.dropAlign.right) {
      classes.push(CLASS_ROOT + "__drop--align-right");
    }
    if (this.props.dropColorIndex) {
      classes.push("background-color-index-" + this.props.dropColorIndex);
    }
    if (this.props.large) {
      classes.push(CLASS_ROOT + "__drop--large");
    }
    if (this.props.small) {
      classes.push(CLASS_ROOT + "__drop--small");
    }

    return React.createElement(
      'div',
      { ref: 'menuDrop', id: this.props.id, className: classes.join(' '),
        onClick: this.props.onClick },
      first,
      second
    );
  }
});

var Menu = React.createClass({
  displayName: 'Menu',

  propTypes: merge({
    closeOnClick: React.PropTypes.bool,
    collapse: React.PropTypes.bool, // deprecated, remove in 0.5
    dropAlign: Drop.alignPropType,
    dropColorIndex: React.PropTypes.string,
    icon: React.PropTypes.node,
    inline: React.PropTypes.bool,
    label: React.PropTypes.string,
    large: React.PropTypes.bool,
    primary: React.PropTypes.bool,
    small: React.PropTypes.bool
  }, Box.propTypes),

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [KeyboardAccelerators],

  getDefaultProps: function getDefaultProps() {
    return {
      closeOnClick: true,
      direction: 'column',
      dropAlign: { top: 'top', left: 'left' },
      pad: 'none',
      small: false,
      responsive: true
    };
  },

  getInitialState: function getInitialState() {
    if (this.props.hasOwnProperty('collapse')) {
      console.log('The Grommet Menu "collapse" property is deprecated. Please use "inline" instead.'); // TODO: remove this message in version 0.4.0
    }
    var inline;
    if (this.props.hasOwnProperty('inline')) {
      inline = this.props.inline;
    } else {
      inline = !this.props.label && !this.props.icon;
    }
    return {
      // state may be 'collapsed', 'focused' or 'expanded' (active).
      state: 'collapsed',
      inline: inline,
      dropId: 'menuDrop'
    };
  },

  componentDidMount: function componentDidMount() {
    if (this.refs.control) {
      var controlElement = this.refs.control.getDOMNode();
      this.setState({
        dropId: 'menu-drop-' + controlElement.getAttribute('data-reactid')
      });

      controlElement.setAttribute('role', 'menu');
      var expanded = this.state.state === 'expanded';
      controlElement.setAttribute('aria-expanded', expanded);
      if (this.props.label) {
        controlElement.setAttribute('aria-label', this.props.label);
      } else if (this.props.icon) {
        try {
          var icon = controlElement.getElementsByClassName('control-icon')[0];
          if (!icon.getAttribute('id')) {
            icon.setAttribute('id', icon.getAttribute('data-reactid'));
          }
          controlElement.setAttribute('aria-labelledby', icon.getAttribute('id'));
        } catch (exception) {
          console.log('Unable to add aria-label to Menu component.');
        }
      }
    }

    if (this.props.inline && this.props.responsive) {
      this._responsive = Responsive.start(this._onResponsive);
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // Set up keyboard listeners appropriate to the current state.

    var activeKeyboardHandlers = {
      esc: this._onClose
    };
    var focusedKeyboardHandlers = {
      space: this._onOpen,
      down: this._onOpen
    };

    switch (this.state.state) {
      case 'collapsed':
        this.stopListeningToKeyboard(focusedKeyboardHandlers);
        this.stopListeningToKeyboard(activeKeyboardHandlers);
        document.removeEventListener('click', this._onClose);
        if (this._drop) {
          this._drop.remove();
          this._drop = null;
        }
        break;
      case 'focused':
        this.stopListeningToKeyboard(activeKeyboardHandlers);
        this.startListeningToKeyboard(focusedKeyboardHandlers);
        break;
      case 'expanded':
        this.stopListeningToKeyboard(focusedKeyboardHandlers);
        this.startListeningToKeyboard(activeKeyboardHandlers);
        if (prevState.state !== 'expanded') {
          document.addEventListener('click', this._onClose);
          this._drop = Drop.add(this.refs.control.getDOMNode(), this._renderDrop(), this.props.dropAlign);
          this._drop.container.focus();
        }
        this._drop.render(this._renderDrop());
        break;
    }
    if (this.refs.control) {
      var controlElement = this.refs.control.getDOMNode();
      var expanded = this.state.state === 'expanded';
      controlElement.setAttribute('aria-expanded', expanded);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    document.removeEventListener('click', this._onClose);
    if (this._drop) {
      this._drop.remove();
    }
    if (this._responsive) {
      this._responsive.stop();
    }
  },

  _onOpen: function _onOpen(event) {
    event.preventDefault();
    this.setState({ state: 'expanded' });
  },

  _onClose: function _onClose() {
    this.setState({ state: 'collapsed' });
    if (document.activeElement === this.getDOMNode()) {
      this.setState({ state: 'focused' });
    } else {
      this.getDOMNode().focus();
    }
  },

  _onFocusControl: function _onFocusControl() {
    this.setState({ state: 'focused' });
  },

  _onBlurControl: function _onBlurControl() {
    if (this.state.state === 'focused') {
      this.setState({ state: 'collapsed' });
    }
  },

  _onSink: function _onSink(event) {
    event.stopPropagation();
    // need to go native to prevent closing via document
    event.nativeEvent.stopImmediatePropagation();
  },

  _onResponsive: function _onResponsive(small) {
    // deactivate if we change resolutions
    var newState = this.state.state;
    if (this.state.state === 'expanded') {
      newState = 'focused';
    }
    if (small) {
      this.setState({ inline: false, active: newState });
    } else {
      this.setState({
        inline: this.props.inline,
        active: newState,
        state: 'collapsed'
      });
    }
  },

  _renderControl: function _renderControl() {
    var result = null;
    var icon = null;
    var controlClassName = CLASS_ROOT + "__control";

    var classes = [controlClassName];

    if (this.props.icon) {
      classes.push(controlClassName + "--labelled");
      icon = this.props.icon;
    } else {
      classes.push(controlClassName + "--fixed-label");
      icon = React.createElement(MoreIcon, null);
    }

    if (this.props.label) {
      result = React.createElement(
        'div',
        { className: classes.join(' ') },
        React.createElement(
          'div',
          { className: controlClassName + "-icon" },
          icon
        ),
        React.createElement(
          'span',
          { tabIndex: '-1', className: controlClassName + "-label" },
          this.props.label
        ),
        React.createElement(DropCaretIcon, { className: controlClassName + "-drop-icon" })
      );
    } else {
      result = React.createElement(
        'div',
        { className: controlClassName },
        icon
      );
    }
    return result;
  },

  _renderDrop: function _renderDrop() {
    var other = pick(this.props, keys(Box.propTypes));

    var controlContents = React.createElement(
      'div',
      { onClick: this._onClose },
      this._renderControl()
    );

    var onClick;
    if (this.props.closeOnClick) {
      onClick = this._onClose;
    } else {
      onClick = this._onSink;
    }
    return React.createElement(
      MenuDrop,
      _extends({ tabIndex: '-1', router: this.context.router,
        dropAlign: this.props.dropAlign,
        dropColorIndex: this.props.dropColorIndex,
        small: this.props.small,
        large: this.props.large
      }, other, {
        onClick: onClick,
        id: this.state.dropId,
        control: controlContents }),
      this.props.children
    );
  },

  _classes: function _classes(prefix) {
    var classes = [prefix];

    if (this.props.direction) {
      classes.push(prefix + "--" + this.props.direction);
    }
    if (this.props.large) {
      classes.push(prefix + "--large");
    }
    if (this.props.small) {
      classes.push(prefix + "--small");
    }
    if (this.props.primary) {
      classes.push(prefix + "--primary");
    }

    return classes;
  },

  render: function render() {
    var classes = this._classes(CLASS_ROOT);
    if (this.state.inline) {
      classes.push(CLASS_ROOT + "--inline");
    } else {
      classes.push(CLASS_ROOT + "--controlled");
      if (this.props.label) {
        classes.push(CLASS_ROOT + "--labelled");
      }
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    if (this.state.inline) {
      var other = pick(this.props, keys(Box.propTypes));

      return React.createElement(
        Box,
        _extends({ tag: 'nav' }, other, { className: classes.join(' '), onClick: this._onClose }),
        this.props.children
      );
    } else {

      var controlContents = this._renderControl();

      return React.createElement(
        'div',
        { ref: 'control', className: classes.join(' '),
          tabIndex: '0',
          onClick: this._onOpen,
          onFocus: this._onFocusControl,
          onBlur: this._onBlurControl },
        controlContents
      );
    }
  }
});

module.exports = Menu;