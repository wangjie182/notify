!(() => {
    // 将HTML转换为节点
    const html2node = (str) => {
        let container = document.createElement('div');
        container.innerHTML = str;
        return container.children[0];
    };
    // 帮助函数：赋值、扩展
    const extend = (a, b) => {
        for (let i in b) {
            if (typeof a[i] === 'undefined') {
                a[i] = b[i];
            }
        }
        return a;
    };
    // 帮助函数：add ClassName
    const addClass = (node, className) => {
        let current = node.className || "";
        if ((` ${current} `).indexOf(` ${className} `) === -1) {
            node.className = current ? (`${current} ${className}`) : className;
        }
    };
    // 帮助函数：remove ClassName
    const removeClass = (node, className) => {
        let current = node.className || "";
        node.className = (` ${current} `).replace(` ${className} `, " ").trim();
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
    const template =
        '<section class="jk-notify">\
        <div class="jk-notify-align"></div>\
        <div class="jk-notify-container animated">\
            <div class="jk-notify-header">\
                <span class="jk-notify-indicator glyphicon"></span>\
                <h4 class="jk-notify-title"></h4>\
                <div class="jk-notify-closer"><span class="glyphicon glyphicon-remove" title="Close"></span></div>\
            </div>\
            <div class="jk-notify-content"></div>\
            <div class="jk-notify-operation">\
            <button type="button" class="jk-notify-operation-cancel btn btn-default"></button>\
            <button type="button" class="jk-notify-operation-confirm btn btn-default btn-primary"></button>\
            </div>\
        </div>\
    </section>';

    // KNotify
    function KNotify(opt) {
        extend(this, opt);
        this.container = this.container || document.body; // 容器节点
        this.notify = this._layout.cloneNode(true);
        this.notifyContainer = this.notify.querySelector('.jk-notify-container');
        this.notifyType = this.notify.querySelector('.jk-notify-indicator')
        this.notifyTitle = this.notify.querySelector('.jk-notify-title');
        this.notifyCloser = this.notify.querySelector('.jk-notify-closer');
        this.notifyContent = this.notify.querySelector('.jk-notify-content');
        this.notifyOperation = this.notify.querySelector('.jk-notify-operation');
        this.notifyOperationConfirm = this.notify.querySelector('.jk-notify-operation-confirm');
        this.notifyOperationCancel = this.notify.querySelector('.jk-notify-operation-cancel');
        this.container.appendChild(this.notify);
        this._init();
    }
    // 原型extend
    extend(KNotify.prototype, {
        _layout: html2node(template),
        _init() {
            this._i18n();
            this._overlay();
            if (this.position) {
                this._position();
            } else {
                this.notify.style.verticalAlign = 'middle';
            }
            if (this.style) {
                this._style();
            } else {
                this.notifyContainer.style.width = '300px';
                this.notifyContainer.style.height = 'auto';
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
                if (this.closer && (this.closer.show === true || this.closer.show === 'auto') || (this.operation && this.operation.show === true)) {
                    this._closer(this.closer.show);
                } else {
                    this._closer(true);
                }
            }
            if (this.operation && this.operation.show === true) {
                this._operation();
            } else {
                this.notifyOperation.style.display = 'none';
            }
            if (this.animation && this.animation.show === true) {
                this._animationEnter(this.animation.enter);
            }
        },
        _i18n() {
            if (this.i18n && this.i18n === 'EN') {
                this.notifyOperationConfirm.innerHTML = 'OK';
                this.notifyOperationCancel.innerHTML = 'Cancel';
            } else {
                this.notifyOperationConfirm.innerHTML = '确认';
                this.notifyOperationCancel.innerHTML = '取消';
            }
        },
        _overlay() {
            if (this.overlay) {
                this.notify.style.background = this.overlay.background || 'transparent';
            }
        },
        _position() {
            if (this.position === 'center') {
                this.notify.style.verticalAlign = 'middle';
            }
        },
        _style() {
            for (let i in this.style) {
                this.notifyContainer.style[i] = this.style[i];
            }
        },
        _type(type = 'notice') {
            if (type === 'notice') {
                addClass(this.notifyType, 'glyphicon-exclamation-sign');
            }
        },
        _title() {
            this.notifyTitle.innerHTML = this.title;
        },
        _content() {
            this.notifyContent.innerHTML = this.content;
        },
        _closer(show = true) {
            if (show === 'auto') {
                this.notifyCloser.style.visibility = 'hidden';
                this.notifyContainer.addEventListener('mouseover', () => { this.notifyCloser.style.visibility = 'visible'; }, false);
                this.notifyContainer.addEventListener('mouseout', () => { this.notifyCloser.style.visibility = 'hidden'; }, false);
                this._destroy(this.notifyCloser);
            } else if (show === true) {
                this._destroy(this.notifyCloser);
            } else {
                this.notifyCloser.style.visibility = 'hidden';
            }
        },
        _autoHide(time = 2000) {
            setTimeout(() => {
                if (document.querySelector('.jk-notify')) {
                    if (this.animation && this.animation.show === true) {
                        this._animationExit();
                        setTimeout(() => {
                            this._closerClick();
                        }, 1000);
                    }else {
                        this._closerClick();
                    }
                }
            }, time);
        },
        _operation() {
            this.notifyOperation.style.display = 'block';
            this._destroy(this.notifyOperationConfirm);
            this._destroy(this.notifyOperationCancel);
        },
        _animationEnter(animate = 'fadeIn') {
            addClass(this.notifyContainer, animate);
        },
        _animationExit(animate = 'fadeOut') {
            removeClass(this.notifyContainer, this.animation.enter);
            addClass(this.notifyContainer, animate);
        },
        _destroy(node) {
            node.addEventListener('click', () => {
                if (node === this.notifyOperationCancel) {
                    if (this.animation && this.animation.show === true) {
                        this._animationExit();
                        setTimeout(() => {
                            this._cancelClick();
                        }, 1000);
                    } else {
                        this._cancelClick();
                    }
                } else if (node === this.notifyOperationConfirm) {
                    if (this.animation && this.animation.show === true) {
                        this._animationExit();
                        setTimeout(() => {
                            this._confirmClick();
                        }, 1000);
                    } else {
                        this._confirmClick();
                    }
                } else {
                    if (this.animation && this.animation.show === true) {
                        this._animationExit();
                        setTimeout(() => {
                            this._closerClick();
                        }, 1000)
                    } else {
                        this._closerClick();
                    }
                }
            }, false);
        },
        _cancelClick() {
            this.container.removeChild(this.notify);
            if (this.operation.cancel) {
                this.operation.cancel();
            }
        },
        _confirmClick() {
            this.container.removeChild(this.notify);
            if (this.operation.confirm) {
                this.operation.confirm();
            }
        },
        _closerClick() {
            this.container.removeChild(this.notify);
            if (this.closer.close) {
                this.closer.close();
            }
        },
    })

    // API支持:  Amd || Commonjs  || Global 
    // commonjs
    if (typeof exports === 'object') {
        module.exports = KNotify;
        // amd
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return KNotify
        });
    } else {
        // 暴露到全局
        window.KNotify = KNotify;
    }
})()