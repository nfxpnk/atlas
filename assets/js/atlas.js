(function() {
	var AtlasStateGenerator;

	AtlasStateGenerator = (function() {
		var pseudo_selectors;

		pseudo_selectors = ['hover', 'enabled', 'disabled', 'active', 'visited', 'focus', 'target', 'checked', 'empty', 'first-of-type', 'last-of-type', 'first-child', 'last-child'];

		function AtlasStateGenerator() {
			var idx, replaceRule, rule, stylesheet, _i, _len, _len2, _ref;

			try {
				_ref = document.styleSheets;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					stylesheet = _ref[_i];
					if (stylesheet.href && stylesheet.href.indexOf(document.domain) >= 0) {
						this.insertRules(stylesheet.cssRules);
					}
				}
			} catch (_error) {}
		}

		AtlasStateGenerator.prototype.insertRules = function(rules) {
			var pseudos = new RegExp("(\\:" + (pseudo_selectors.join('|\\:')) + ")", "g");
			for (idx = 0, _len2 = rules.length; idx < _len2; idx++) {
				rule = rules[idx];
				console.log(rule);
				console.log(rule.type);
				if (rule.type === CSSRule.MEDIA_RULE) {
					this.insertRules(rule.cssRules);
				} else if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
					replaceRule = function(matched, stuff) {
						return matched.replace(/\:/g, '.pseudo-class-');
					};
					this.insertRule(rule.cssText.replace(pseudos, replaceRule));
				}
				pseudos.lastIndex = 0;
			}
		};

		AtlasStateGenerator.prototype.insertRule = function(rule) {
			var headEl, styleEl;
			headEl = document.getElementsByTagName('head')[0];
			styleEl = document.createElement('style');
			styleEl.type = 'text/css';
			if (styleEl.styleSheet) {
				styleEl.styleSheet.cssText = rule;
			} else {
				styleEl.appendChild(document.createTextNode(rule));
			}
			return headEl.appendChild(styleEl);
		};

		return AtlasStateGenerator;

	})();

	new AtlasStateGenerator;

}).call(this);
