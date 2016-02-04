import StickyElement from './StickyElement';

export default (() => {
  return (selector, opts) => {
    const stickyElementsTab = [];
    const elements = [].slice.call(document.querySelectorAll(selector));
    for (let i = 0; i < elements.length; i++) {
      stickyElementsTab.push(new StickyElement(elements[i], opts));
    };
    return stickyElementsTab;
  };
})();
