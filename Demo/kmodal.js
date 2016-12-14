'use strict';
!function () {
    // 将HTML转换为节点
    var html2node = function html2node(str) {
        var container = document.createElement('div');
        container.innerHTML = str;
        return container.children[0];
    };
    // 帮助函数：赋值、扩展
    var extend = function extend(a, b) {
        for (var i in b) {
            if (typeof a[i] === 'undefined') {
                a[i] = b[i];
            }
        }
        return a;
    };
    // 帮助函数：add ClassName
    var addClass = function addClass(node, className) {
        var current = node.className || "";
        if ((' ' + current + ' ').indexOf(' ' + className + ' ') === -1) {
            node.className = current ? current + ' ' + className : className;
        }
    };
    // 帮助函数：remove ClassName
    var removeClass = function removeClass(node, className) {
        var current = node.className || "";
        node.className = (' ' + current + ' ').replace(' ' + className + ' ', " ").trim();
    };
    // // 帮助函数：has ClassName
    // const hasClass = (node, className) => {
    //     let current = node.className || "";
    //     if (current.match(new RegExp(`(\\s|^)${className}(\\s|$)`))) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };
    // 实例
    var template = '<section class="jk-modal">\
        <div class="jk-model-align"></div>\
        <div class="jk-modal-container animated">\
            <div class="jk-modal-header">\
                <span class="jk-modal-indicator glyphicon"></span>\
                <h4 class="jk-modal-title"></h4>\
                <div class="jk-model-closer"><span class="glyphicon glyphicon-remove" title="Close"></span></div>\
            </div>\
            <div class="jk-modal-content"></div>\
            <div class="jk-modal-operation">\
            <button type="button" class="jk-modal-operation-cancel btn btn-default"></button>\
            <button type="button" class="jk-modal-operation-confirm btn btn-default btn-primary"></button>\
            </div>\
        </div>\
    </section>';

    // KModal
    function KModal(opt) {
        extend(this, opt);
        this.container = this.container || document.body; // 容器节点
        this.modal = this._layout.cloneNode(true);
        this.modalContainer = this.modal.querySelector('.jk-modal-container');
        this.modalType = this.modal.querySelector('.jk-modal-indicator');
        this.modalTitle = this.modal.querySelector('.jk-modal-title');
        this.modalCloser = this.modal.querySelector('.jk-model-closer');
        this.modalContent = this.modal.querySelector('.jk-modal-content');
        this.modalOperation = this.modal.querySelector('.jk-modal-operation');
        this.modalOperationConfirm = this.modal.querySelector('.jk-modal-operation-confirm');
        this.modalOperationCancel = this.modal.querySelector('.jk-modal-operation-cancel');
        this.container.appendChild(this.modal);
        this._init();
    }
    // 原型extend
    extend(KModal.prototype, {
        _layout: html2node(template),
        _init: function _init() {
            this._i18n();
            this._overlay();
            if (this.position) {
                this._position();
            } else {
                this.modal.style.verticalAlign = 'middle';
            }
            if (this.style) {
                this._style();
            } else {
                this.modalContainer.style.width = '300px';
                this.modalContainer.style.height = 'auto';
            }
            this._type(this.type);
            this._title();
            this._content();
            if (this.hide && this.hide.show === true) {
                this._autoHide(this.hide.time);
                if (this.closer) {
                    this._closer(this.closer.show);
                } else {
                    this._closerClick();
                }
            } else {
                if (this.closer && (this.closer.show === true || this.closer.show === 'auto') || this.operation && this.operation.show === true) {
                    this._closer(this.closer.show);
                } else {
                    this._closer(true);
                }
            }
            if (this.operation && this.operation.show === true) {
                this._operation();
            } else {
                this.modalOperation.style.display = 'none';
            }
            if (this.animation && this.animation.show === true) {
                this._animationEnter(this.animation.enter);
            }
        },
        _i18n: function _i18n() {
            if (this.i18n && this.i18n === 'EN') {
                this.modalOperationConfirm.innerHTML = 'Confirm';
                this.modalOperationCancel.innerHTML = 'Cancel';
            } else {
                this.modalOperationConfirm.innerHTML = '确认';
                this.modalOperationCancel.innerHTML = '取消';
            }
        },
        _overlay: function _overlay() {
            if (this.overlay) {
                this.modal.style.background = this.overlay.background || 'transparent';
            }
        },
        _position: function _position() {
            if (this.position === 'center') {
                this.modal.style.verticalAlign = 'middle';
            }
        },
        _style: function _style() {
            for (var i in this.style) {
                this.modalContainer.style[i] = this.style[i];
            }
        },
        _type: function _type() {
            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'notice';

            if (type === 'notice') {
                addClass(this.modalType, 'glyphicon-exclamation-sign');
            }
        },
        _title: function _title() {
            this.modalTitle.innerHTML = this.title;
        },
        _content: function _content() {
            this.modalContent.innerHTML = this.content;
        },
        _closer: function _closer() {
            var _this = this;

            var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (show === 'auto') {
                this.modalCloser.style.visibility = 'hidden';
                this.modalContainer.addEventListener('mouseover', function () {
                    _this.modalCloser.style.visibility = 'visible';
                }, false);
                this.modalContainer.addEventListener('mouseout', function () {
                    _this.modalCloser.style.visibility = 'hidden';
                }, false);
                this._destroy(this.modalCloser);
            } else if (show === true) {
                this._destroy(this.modalCloser);
            } else {
                this.modalCloser.style.visibility = 'hidden';
            }
        },
        _autoHide: function _autoHide() {
            var _this2 = this;

            var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;

            setTimeout(function () {
                if (document.querySelector('.jk-modal')) {
                    if (_this2.animation && _this2.animation.show === true) {
                        _this2._animationExit();
                        setTimeout(function () {
                            _this2._closerClick();
                        }, 1000);
                    } else {
                        _this2._closerClick();
                    }
                }
            }, time);
        },
        _operation: function _operation() {
            this.modalOperation.style.display = 'block';
            this._destroy(this.modalOperationConfirm);
            this._destroy(this.modalOperationCancel);
        },
        _animationEnter: function _animationEnter() {
            var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fadeIn';

            addClass(this.modalContainer, animate);
        },
        _animationExit: function _animationExit() {
            var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'fadeOut';

            removeClass(this.modalContainer, this.animation.enter);
            addClass(this.modalContainer, animate);
        },
        _destroy: function _destroy(node) {
            var _this3 = this;

            node.addEventListener('click', function () {
                if (node === _this3.modalOperationCancel) {
                    if (_this3.animation && _this3.animation.show === true) {
                        _this3._animationExit();
                        setTimeout(function () {
                            _this3._cancelClick();
                        }, 1000);
                    } else {
                        _this3._cancelClick();
                    }
                } else if (node === _this3.modalOperationConfirm) {
                    if (_this3.animation && _this3.animation.show === true) {
                        _this3._animationExit();
                        setTimeout(function () {
                            _this3._confirmClick();
                        }, 1000);
                    } else {
                        _this3._confirmClick();
                    }
                } else {
                    if (_this3.animation && _this3.animation.show === true) {
                        _this3._animationExit();
                        setTimeout(function () {
                            _this3._closerClick();
                        }, 1000);
                    } else {
                        _this3._closerClick();
                    }
                }
            }, false);
        },
        _cancelClick: function _cancelClick() {
            this.container.removeChild(this.modal);
            if (this.operation.cancel) {
                this.operation.cancel();
            }
        },
        _confirmClick: function _confirmClick() {
            this.container.removeChild(this.modal);
            if (this.operation.confirm) {
                this.operation.confirm();
            }
        },
        _closerClick: function _closerClick() {
            this.container.removeChild(this.modal);
            if (this.closer.close) {
                this.closer.close();
            }
        }
    });

    // API支持:  Amd || Commonjs  || Global 
    // commonjs
    if (typeof exports === 'object') {
        module.exports = KModal;
        // amd
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return KModal
        });
    } else {
        // 暴露到全局
        window.KModal = KModal;
    }
}();