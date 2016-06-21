angular.module("rr.api.v2.explorer.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("explorer.bootstrap.html","<div class=\"row\">\n	<!-- FORM -->\n	<div class=\"col-sm-6 col-xs-12\">\n		<h3>Build Query</h3>\n		<form ng-submit=\"vm.doSearch(explorerForm.$valid)\" name=\"explorerForm\" role=\"form\" class=\"form-horizontal\" novalidate>\n			<!-- SELECT -->\n			<div class=\"form-group\">\n				<label class=\"control-label col-sm-2\" for=\"select\">$select:</label>\n				<div class=\"col-sm-10\">\n					<input class=\"form-control\" ng-change=\"vm.updateQuery()\" name=\"select\" ng-model=\"vm.data.searchForm.select\" id=\"select\" type=\"text\"/>\n				</div>\n			</div>\n			<!-- FILTER -->\n			<div class=\"form-group\">\n				<label class=\"control-label col-sm-2\" for=\"filter\">$filter:</label>\n				<div class=\"col-sm-10\">\n					<div class=\"row\" ng-repeat-start=\"filter in vm.data.searchForm.filter track by $index\">\n						<div class=\"col-sm-10 col-xs-10\">\n							<input  \n								ng-change=\"vm.updateQuery()\" \n								name=\"filter_{{$index}}\" \n								class=\"form-control\" \n								required\n								ng-model=\"vm.data.searchForm.filter[$index].value\" \n								id=\"filter_{{$index+1}}\" \n								type=\"text\"/>\n							<div ng-show=\"explorerForm.$submitted || explorerForm.filter_{{$index}}.$touched\">\n								<p ng-show=\"explorerForm.filter_{{$index}}.$invalid\" class=\"help-block\">\n									<i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i>&nbsp;Filter must not be empty\n								</p>\n							</div>\n						</div>\n						<!-- REMOVE FILTER -->\n						<div class=\"col-sm-2 col-xs-2\">\n							<button type=\"button\" class=\"btn btn-danger pull-right\" ng-click=\"vm.removeFilter(filter)\"><i class=\"fa fa-trash-o\"></i></button>\n						</div>\n					</div>\n					<!-- JOIN: AND | OR -->\n					<div class=\"row\" ng-repeat-end ng-if=\"$index + 1 < vm.data.searchForm.filter.length\" style=\"margin-top:15px; margin-bottom:15px\">\n						<div class=\"visible-xs col-xs-3\"></div>\n						<div class=\"col-sm-3 col-sm-offset-4 col-xs-4 text-center\">\n							<select ng-model=\"vm.data.searchForm.filter[$index].join\" class=\"form-control\" ng-change=\"vm.updateQuery()\">\n								<option value=\"and\" selected>and</option>\n								<option value=\"or\">or</option>\n							</select>\n						</div>\n					</div>\n					<!-- EMPTY MESSAGE -->\n					<div class=\"row\" ng-show=\"vm.data.searchForm.filter.length < 1\">\n						<div class=\"col-sm-12\">\n							<div class=\"bg-info\" style=\"padding:7px\"><i class=\"fa fa-info\" aria-hidden=\"true\"></i>&nbsp;Click the button below to add your first filter</div>\n						</div>\n					</div>\n					<!-- ADD FILTER -->\n					<div class=\"row\">\n						<div class=\"col-sm-12 col-xs-12 text-center\" style=\"margin-top:20px\">\n							<button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"vm.addFilter()\">Add Filter</button>\n						</div>\n					</div>\n				</div>\n			</div>\n			<!-- ORDERBY -->\n			<div class=\"form-group\">\n				<label class=\"control-label col-sm-2\" for=\"orderby\">$orderby:</label>\n				<div class=\"col-sm-10\">\n					<div style=\"margin-bottom:15px\" class=\"row\" ng-repeat=\"orderby in vm.data.searchForm.orderby track by $index\">\n						<div class=\"col-sm-7 col-xs-6\">\n							<input \n								name=\"orderby_{{$index}}\" \n								ng-model=\"vm.data.searchForm.orderby[$index].value\" \n								id=\"orderby_input_{{$index+1}}\" \n								class=\"form-control\"\n								required\n								value=\"orderby.value\"\n								ng-change=\"vm.updateQuery()\"\n								type=\"text\"/>	\n							<div ng-show=\"explorerForm.$submitted || explorerForm.orderby_{{$index}}.$touched\">\n								<p ng-show=\"explorerForm.orderby_{{$index}}.$invalid\" class=\"help-block\"><i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i>&nbsp;Orderby must not be empty</p>\n							</div>\n						</div>\n						<div class=\"col-sm-3 col-xs-3\">\n							<select ng-model=\"vm.data.searchForm.orderby[$index].direction\" class=\"form-control\" ng-change=\"vm.updateQuery()\">\n								<option value=\"asc\" selected>asc</option>\n								<option value=\"desc\">desc</option>\n							</select>\n						</div>\n						<!-- REMOVE FILTER -->\n						<div class=\"col-sm-2 col-xs-3\">\n							<button type=\"button\" class=\"btn btn-danger pull-right\" ng-click=\"vm.removeOrderby(orderby)\"><i class=\"fa fa-trash-o\"></i></button>\n						</div>\n					</div>\n					<!-- EMPTY MESSAGE -->\n					<div class=\"row\" ng-show=\"vm.data.searchForm.orderby.length < 1\" style=\"margin-bottom:20px\">\n						<div class=\"col-sm-12\">\n							<div class=\"bg-info\" style=\"padding:7px\"><i class=\"fa fa-info\" aria-hidden=\"true\"></i>&nbsp;Click the button below to add your first orderby</div>\n						</div>\n					</div>\n					<!-- ADD ORDERBY -->\n					<div class=\"row\">\n						<div class=\"col-sm-12 col-xs-12 text-center\">\n							<button type=\"button\" class=\"btn btn-success pull-right\" ng-click=\"vm.addOrderby()\">Add Orderby</button>\n						</div>\n					</div>\n				</div>\n			</div>\n			<!-- TOP -->\n			<div class=\"form-group\">\n				<label class=\"control-label col-sm-2\" for=\"top\">$top:</label>\n				<div class=\"col-sm-4\">\n					<input ng-change=\"vm.updateQuery()\" ng-model=\"vm.data.searchForm.top\" name=\"top\" class=\"form-control\" id=\"top\" type=\"tel\"/>\n				</div>\n				<div class=\"visible-xs\">&nbsp;<br></div>\n				<!-- SKIP -->\n				<label class=\"control-label col-sm-2\" for=\"skip\">$skip:</label>\n				<div class=\"col-sm-4\">\n					<input ng-change=\"vm.updateQuery()\" ng-model=\"vm.data.searchForm.skip\" name=\"skip\" class=\"form-control\" id=\"skip\" type=\"tel\"/>\n				</div>\n			</div>\n			<div class=\"form-group\">\n				<div class=\"col-sm-12 col-xs-12\">\n					<button type=\"submit\" class=\"btn btn-primary pull-right\" ng-disabled=\"vm.data.searching\" value=\"search\">\n						<span ng-if=\"!vm.data.searching\">Search</span>\n						<span ng-if=\"vm.data.searching\">Searching...</span>\n					</button>\n				</div>\n			</div>\n		</form>\n	</div>\n	<!-- QUERY -->\n	<div class=\"col-sm-6 col-xs-12\">\n		<h3>Request</h3>\n		<code style=\"display:block; padding:10px\">\n			{{vm.data.fullRequest}}\n		</code>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-sm-12\">\n			<br>\n			<hr>\n		</div>\n	</div>\n	<!-- RESULTS -->\n	<div class=\"col-md-10 col-md-offset-1 col-sm-12 col-xs-12\">\n		<h3 class=\"text-center\">Results<span ng-if=\"vm.data.total_results > -1\">:&nbsp;{{vm.data.total_results}}</span></h3>\n		<img ng-if=\"vm.data.searching\" src=\"vm.loader\">\n		<div class=\"results\" ng-if=\"vm.data.results && !vm.data.error\">\n			<pre style=\"max-height:600px\">{{vm.data.results | prettyJson}}</pre>\n		</div>\n		<div class=\"error\" ng-if=\"vm.data.error\">\n			<pre>{{vm.data.error | prettyJson}}</pre>\n		</div>\n		<div ng-if=\"!vm.data.error && !vm.data.results\">\n			<code class=\"text-center\" style=\"display:block; padding:10px\">Click \"Search\" to hit the Retsrabbit V2 API!</code>\n		</div>\n	</div>\n</div>");}]);