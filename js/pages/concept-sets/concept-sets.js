define([
	'knockout',
	'text!./concept-sets.html',
	'providers/Component',
	'./components/browse',
	'./components/export',
  'utils/CommonUtils',
	'components/heading',
  'components/tabs',
], function (
	ko,
	view,
	Component,
  browseTab,
  exportTab,
	commonUtils
) {
	class ConceptSets extends Component {
		constructor(params) {
			super(params);
			this.tabs = {
				browse: {
					viewModel: new browseTab.viewModel(params),
					template: browseTab.template
				},
				export: {
					viewModel: new exportTab.viewModel(params),
					template: exportTab.template
				},
			};

		}
	}

	return commonUtils.build('concept-sets', ConceptSets, view);
});
