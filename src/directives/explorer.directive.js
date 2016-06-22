(function() {
    'use strict';
    angular
        .module('rr.api.v2.explorer.directive.explorer', [])
        .directive('apiExplorer', Directive);

    Directive.$inject = ['ApiConfig', 'PropertyFactory'];

    function Directive(ApiConfig, PropertyFactory) {
        var controller = ['$scope', '$interval', '$document', 'PropertyFactory', function($scope, $interval, $document, PropertyFactory) {
            var vm = this,
                promise,
                someElement = angular.element(document.getElementById('query-results'));

            //Watch for when the search attribute value changes from the parent scope
            $scope.$watch(angular.bind(this, function() {
                return this.search;
            }), function(newVal) {
                if (newVal && newVal !== 'undefined' && newVal !== undefined && (typeof newVal) != 'function') {
                    vm.data.searchForm.select = newVal.query.select;
                    vm.data.searchForm.filter = newVal.query.filter;
                    vm.data.searchForm.orderby = newVal.query.orderby;
                    vm.data.searchForm.top = newVal.query.top;
                    vm.data.searchForm.skip = newVal.query.skip;

                    //reset to default
                    vm.data.error = null;
                    vm.data.results = null;
                    vm.data.searching = false;
                    vm.data.total_results = -1;

                    _buildQuery();
                }
            });

            vm.data = {
                searchForm: {
                    select: '',
                    filter: [{ value: '', join: 'and' }],
                    orderby: [{ value: '', direction: 'asc' }],
                    top: '',
                    skip: ''
                },
                fullRequest: ApiConfig.apiUrl + 'property?',
                request: '',
                results: null,
                total_results: -1,
                error: null,
                searching: false,
                query_time: -1
            };

            /* --- Bind Method Handles --- */
            vm.doSearch = _search;
            vm.addFilter = _addFilter;
            vm.removeFilter = _removeFilter;
            vm.addOrderby = _addOrderby;
            vm.removeOrderby = _removeOrderby;
            vm.updateQuery = _buildQuery;

            /* --- Methods --- */
            function _search(valid) {
                if (!valid)
                    return;

                vm.data.total_results = -1;
                vm.data.error = null;
                vm.data.results = null;
                vm.data.searching = true;

                var start = new Date();

                PropertyFactory.search(vm.data.request).then(function(res) {
                    $document.scrollToElement(someElement, 70, 300);
                    var end = new Date();

                    //vm.data.query_time = end.getTime() - start.getTime();
                    vm.data.error = null;
                    vm.data.results = res;
                    vm.data.total_results = res.value.length;
                    vm.data.searching = false;
                    _startCount(end.getTime() - start.getTime());
                }, function(err) {
                    $document.scrollToElement(someElement, 70, 300);
                    vm.data.query_time = -1;
                    vm.data.searching = false;
                    vm.data.error = err.error;
                });
            }


            function _addFilter() {
                vm.data.searchForm.filter.push({
                    value: '',
                    join: 'and'
                });
            }

            function _removeFilter(filter) {
                var i = vm.data.searchForm.filter.indexOf(filter);
                vm.data.searchForm.filter.splice(i, 1);
                _buildQuery();
            }

            function _addOrderby() {
                vm.data.searchForm.orderby.push({
                    value: '',
                    direction: 'asc'
                });
            }

            function _removeOrderby(orderby) {
                var i = vm.data.searchForm.orderby.indexOf(orderby);
                vm.data.searchForm.orderby.splice(i, 1);
                _buildQuery();
            }

            /**
             * This method handles building the query string based on the selected
             * parameters
             * 
             * @return void
             */
            function _buildQuery() {
                var _q = '';
                var i = 0;

                var params = [0, 0, 0, 0, 0]; //select, filter, orderby, top, skip

                //select
                if (vm.data.searchForm.select !== '') {
                    params[0] = 1;
                    _q += '$select=' + vm.data.searchForm.select;
                }

                //filter
                if (vm.data.searchForm.filter.length) {
                    params[1] = 1;

                    if (params[0])
                        _q += '&$filter=';
                    else
                        _q += '$filter=';

                    for (i = 0; i < vm.data.searchForm.filter.length; i++) {
                        _q += vm.data.searchForm.filter[i].value;

                        if (vm.data.searchForm.filter[i].value !== '' && i + 1 < vm.data.searchForm.filter.length) {
                            _q += ' ' + vm.data.searchForm.filter[i].join;
                        }

                        if (i + 1 < vm.data.searchForm.filter.length)
                            _q += ' ';
                    }
                }

                //orderby
                if (vm.data.searchForm.orderby.length) {
                    params[2] = 1;

                    if (params[0] + params[1] > 0)
                        _q += '&$orderby=';
                    else
                        _q += '$orderby=';

                    _q += vm.data.searchForm.orderby.map(function(orderby) {
                        if (orderby.value !== '')
                            return orderby.value + ' ' + orderby.direction;
                        else
                            return '';
                    }).join(', ');
                }

                //top
                if (vm.data.searchForm.top != '') {
                    params[3] = 1;

                    if (params[0] + params[1] + params[2] > 0)
                        _q += '&$top=';
                    else
                        _q += '$top='

                    _q += vm.data.searchForm.top;
                }

                //skip
                if (vm.data.searchForm.skip != '') {
                    params[4] = 1;

                    if (params[0] + params[1] + params[2] + params[3] > 0)
                        _q += '&$skip=';
                    else
                        _q += '$skip='

                    _q += vm.data.searchForm.skip;
                }

                vm.data.fullRequest = ApiConfig.apiUrl + 'property?' + _q;
                vm.data.request = _q;
            }

            function _startCount(total_time) {
                var time = 0;
                vm.data.query_time = 0;
                var max_time = 1000;
                var max_interval = 3;

                //skip counter if too long
                if (total_time > 5000) {
                    vm.data.query_time = total_time;
                } else {
                    var interval = max_time / total_time;
                    console.log(interval);
                    if(interval > 7){
                        interval = max_interval;
                    }
                    promise = $interval(function(time) {
                        if (vm.data.query_time == total_time) {

                            $interval.cancel(promise);
                            // textAnim = $timeout(function() {
                            //     $scope.text = 'done!';
                            // }, 1000);

                        } else {
                            vm.data.query_time++;
                        }
                    }, max_interval);
                }
            }
        }];

        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, element, attrs, controller) {},
            templateUrl: 'explorer.bootstrap.html',
            controller: controller,
            controllerAs: 'vm',
            bindToController: {
                search: '=',
                loader: '='
            }
        };
    }
})();
