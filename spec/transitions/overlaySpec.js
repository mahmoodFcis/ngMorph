describe('Overlay', function(){

  var tpl = '<div > <h1> Test Content </h1> </div>';

  beforeEach(module('morph'));
  beforeEach(module('morph.directives'));

  beforeEach(inject(function ($rootScope){
    $rootScope.settings = {
      overlay: {
        template: tpl
      }
    };
    $rootScope.$digest();

  }));

  // basic overlay functionality tests
  it('should compile a template', function(){
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-overlay settings="settings"> Test </button></div>')($rootScope); 

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      var content = angular.element($document[0].body).find('div')[2];

      expect(content.children.length).to.be(1);

    });
  });

  it('should open overlay when directive element is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var morphable = $compile('<div><button ng-morph-overlay settings="settings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0]).opacity === "1";
      }, "wrapper should be visible to user", 35);
    });
  });

  it('should close overlay when closeEl is clicked', function() {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplWithCloseEl = '<div background:black;display:block;"> <span class="close-x">x</span> <h1> Test Content </h1> </div>';
     
      $rootScope.settings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplWithCloseEl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay settings="settings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0]).opacity === "1";
      }, "wrapper should be visible to user", 35);

      runs(function() {
        morphable.children(".close-x")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0]).opacity === '0' ;
      }, "wrapper should be hidden to user", 1000);
    });
  });

  // nested morphable tests
  it('should compile a template containing a nested overlay morphable', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div style="background:black;display:block;"> <button ng-morph-overlay settings="nestedOverlaySettings"> Nested Morphable </button></div>';
      var nestedOverlayTpl = '<div id="nested-overlay" style="background:black;display:block;"> <span class="close-x">x</span></div>';
      
      $rootScope.overlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedOverlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: nestedOverlayTpl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay settings="overlaySettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      runs(function() {
        morphable.find("button")[0].click();
      });

      expect(morphable[0].querySelector("#nested-overlay").childNodes.length).to.be(2);
    });
  });

  it('should open an overlay when a nested directive element is clicked', function () {
    inject(function ($compile, $document, $rootScope, $rootElement) {
      var tplContainingMorphable = '<div id="tpl-containing-morphable"> <button ng-morph-overlay="nestedOverlaySettings"> Nested Morphable </button></div>';
      var nestedOverlayTpl = '<div id="nested-overlay"> <span class="close-x">x</span></div>';
      
      $rootScope.overlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: tplContainingMorphable
        }
      };

      $rootScope.nestedOverlaySettings = {
        closeEl: ".close-x",
        trigger: 'click',
        overlay: {
          template: nestedOverlayTpl
        }
      };

      var morphable = $compile('<div><button ng-morph-overlay settings="overlaySettings"> Test </button></div>')($rootScope);

      $rootElement.append(morphable);
      angular.element($document[0].body).append($rootElement);

      // open first overlay
      runs(function() {
        morphable.find("button")[0].click();
      });

      waitsFor(function() {
        return getComputedStyle(morphable.find("div")[0]).opacity === "1";
      }, "wrapper should be visible to user", 35);

      // open nested overlay
      runs(function() {
        var tpl = angular.element(morphable.find("div")[0]);
        tpl.find("button")[0].click();
      });

      waitsFor(function() {
        var nestedOverlay = morphable.find("div")[0].querySelectorAll("#nested-overlay")[0];
        return getComputedStyle(nestedOverlay).visibility === "visible";
      }, "nested overlay should be visible to user", 35);

    });
  });
});