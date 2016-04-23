import StickyElement from './StickyElement';

export default (() => {
  return (selector, opts) => {
    const elements = [].slice.call(document.querySelectorAll(selector));
    return elements.map((e) => new StickyElement(e, opts));
  };
})();
