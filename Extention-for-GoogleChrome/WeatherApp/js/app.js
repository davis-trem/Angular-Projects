angular.module('myApp',['ngRoute'])
		.provider('Weather', function(){
			var apiKey = "";
			
			this.setApiKey = function(key){
				if (key) this.apiKey = key;
			};
			
			this.getUrl = function(type, ext){
				return "http://api.wunderground.com/api/" + 
					this.apiKey + "/" + type + "/q/" + 
					ext + '.json';
			};
			
			this.$get = function($q, $http){
				var self = this;
				return{
					getWeatherForecast: function(city){
						var d = $q.defer();
						$http({
							method: 'GET',
							url: self.getUrl("forecast", city),
							cache: true
						}).success(function(data){
							/*The wunderground API return the
							object that nests the forecast inside
							the forecast.simpleforcast key*/
							d.resolve(data.forecast.simpleforecast.forecastday);
						}).error(function(err){
							d.reject(err);
						});
						return d.promise;
					},
					getCityDetails: function(query){
						var d = $q.defer();
						$http({
							method: 'GET',
							url: "http://autocomplete.wunderground.com/aq?query=" + query
						}).success(function(data) {
						d.resolve(data.RESULTS);
						}).error(function(err) {
						d.reject(err);
						});
						return d.promise;
					}
				}
			}

		})
		.config(function(WeatherProvider){
			WeatherProvider.setApiKey('18121b19e1f6107d');
		})
		.config(function($routeProvider){
			$routeProvider
				.when('/', {
					templateUrl: 'templates/home.html',
					controller: 'MainController'
				})
				.when('/settings', {
					templateUrl: 'templates/settings.html',
					controller: 'SettingsController'
				})
				.otherwise({redirectTo: '/'});
		})
		.factory('UserService', function(){
			var defaults = {
				location: 'autoip'
			};
			var service = {
				user: {},
				save: function(){
					sessionStorage.presently = 
						angular.toJson(service.user);
				},
				restore: function(){
					//Pulls from sessionStorage
					service.user = 
						angular.fromJson(sessionStorage.presently) || defaults
					return service.user;
				}
			};
			service.restore();
			return service;
		})
		.directive('autoFill', function($timeout) {
			return{
				restrict: 'EA',
				scope: {
					autoFill: '&',
					ngModel: '='
				},
				compile: function(tEle, tAttrs){
					var tplEl = angular.element('<div class="typeahead">' +
					'<input type="text" autocomplete="off" />' +
					'<ul id="autolist" ng-show="reslist">' +
					'<li ng-repeat="res in reslist" ' +
					'>{{res.name}}</li>' +
					'</ul>' +
					'</div>');
					var input = tplEl.find('input');
					input.attr('type', tAttrs.type);
					input.attr('ng-model', tAttrs.ngModel);
					input.attr('timezone', tAttrs.timezone);
					tEle.replaceWith(tplEl);
					
					return function(scope, ele, attrs, ctrl){
						var minKeyCount = attrs.minKeyCount || 3,
							timer,
							input = ele.find('input');
							
						input.bind('keyup', function(e) {
							val = ele.val();
							if (val.length < minKeyCount) {
								if (timer) $timeout.cancel(timer);
								scope.reslist = null;
								return;
							} else {
								if (timer) $timeout.cancel(timer);
								timer = $timeout(function() {
									scope.autoFill()(val)
										.then(function(data) {
											if (data && data.length > 0) {
												scope.reslist = data;
												scope.ngModel = data[0].zmw;
												scope.timezone = data[0].tz;
											}
										});
								}, 300);
							}
						});
						// Hide the reslist on blur
						input.bind('blur', function(e) {
							scope.reslist = null;
							scope.$digest();
						});
					}
				}
			}
		})
		.controller('SettingsController', function($scope, UserService, Weather){
			$scope.user = UserService.user;
			
			$scope.save = function(){
				UserService.save();
			}
			
			$scope.fetchCities = Weather.getCityDetails;
		})
        .controller('MainController', function ($scope, $timeout, Weather, UserService) {
			$scope.date = {};
			var updateTime = function(){
				$scope.date.raw = new Date();
 		        $timeout(updateTime, 1000);
			}
			updateTime();	
			
			$scope.user = UserService.user;
			Weather.getWeatherForecast($scope.user.location)
				.then(function(data){
					$scope.weather = data;
				});
		});
		
