describe('stickyElements', function() {
  describe('Lib', function () {
    it('should set one stickyElements', function () {
      var se = stickyElements('.mocha');
      expect(se.length).to.eql(1);
    });
    it('should set multiple stickyElements', function () {
      var se = stickyElements('.multiple');
      expect(se.length).to.eql(2);
    });
    it('should create stickyElements instance', function () {
      var se = stickyElements('.multiple');
      for (var i = 0; i < se.length; i++) {
        expect(se[i]).to.have.keys('el', 'stickiness');
        expect(se[i].el).to.be.an(HTMLElement);
      };
    });
  });
  describe('Options', function () {
    it('should set default options', function () {
      var se = stickyElements('.mocha');
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 4.5, y: 4.5});
    });
    it('should set default options to multiple elements', function () {
      var se = stickyElements('.multiple');
      for (var i = 0; i < se.length; i++) {
        var stickiness = se[i].stickiness;
        expect(stickiness).to.eql({x: 4.5, y: 4.5});
      };
    });
    it('should set default options to multiple elements with options', function () {
      var se = stickyElements('.multiple', {});
      for (var i = 0; i < se.length; i++) {
        var stickiness = se[i].stickiness;
        expect(stickiness).to.eql({x: 4.5, y: 4.5});
      };
    });
    it('should overidde options', function () {
      var se = stickyElements('.mocha', {stickiness: {x: 2, y: 4}});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 6.6, y: 3.2});
    });
    it('should overidde only X option', function () {
      var se = stickyElements('.mocha', {stickiness: {x: 2}});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 6.6, y: 4.5});
    });
    it('should overidde only Y option', function () {
      var se = stickyElements('.mocha', {stickiness: {y: 4}});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 4.5, y: 3.2});
    });
    it('should accept integer', function () {
      var se = stickyElements('.mocha', {stickiness: 2});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 6.6, y: 6.6});
    });
    it('should accept 0', function () {
      var se = stickyElements('.mocha', {stickiness: 0});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 0.0, y: 0.0});
    });
    it('should accept 0, only X', function () {
      var se = stickyElements('.mocha', {stickiness: {x: 0}});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 0.0, y: 4.5});
    });
    it('should accept 0, only Y', function () {
      var se = stickyElements('.mocha', {stickiness: {y: 0}});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 4.5, y: 0.0});
    });
    it('should limit to 10', function () {
      var se = stickyElements('.mocha', {stickiness: 12});
      var stickiness = se[0].stickiness;
      expect(stickiness).to.eql({x: 1.2, y: 1.2});
    });
  });
});