
export const overlayState = {
  VISIBLE: 1,
  HIDDEN: 0,
  NONE: -1
};

export class ChatState {
  constructor(left = 10, top = 100, opacity = 0.5) {
    this._left = left;
    this._top = top;
    this._opacity = opacity;
  }
  static of(data) {
    return new ChatState(
      data.left,
      data.top,
      data.opacity
    );
  }
  get left() {
    return this._left;
  }
  set left(left) {
    this._left = left;
  }
  get top() {
    return this._top;
  }
  set top(top) {
    this._top = top;
  }
  get opacity() {
    return this._opacity;
  }
  set opacity(opacity) {
    this._opacity = opacity;
  }
  toData() {
    return {
      left: this._left * 1,
      top: this._top * 1,
      opacity: this._opacity * 1
    }
  }
  toCssStyle() {
    return {
      left: this._left + 'px',
      top: this._top + 'px',
      opacity: this._opacity
    }
  }
}
