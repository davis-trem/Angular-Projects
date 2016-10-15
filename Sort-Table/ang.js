angular
	.module("myModule", [])
	.controller("MyController", function($scope){
			var employees=[
			{name: "Messi", age: "23.654", gender:"Male", friends:[{name:"Neymar"},{name:"Suarez"}]},
			{name: "Messi", age: "23.2", gender:"Male" ,friends:[{name:"Neymar"},{name:"Suarez"}]},
			{name: "Ronaldo", age: "27.9874", gender:"Male" ,friends:[{name:"Neymar"},{name:"Suarez"}]},
			{name: "Zalatan", age: "31.32", gender:"Male" ,friends:[{name:"Neymar"},{name:"Suarez"}]},
			{name: "Morgan", age: "231", gender:"Female" ,friends:[{name:"Neymar"},{name:"Suarez"}]}, 
			{name: "OHarare", age: "23.12", gender:"Female",friends:[{name:"Neymar"},{name:"Suarez"}]} 
			];
			var sortC = true;
			$scope.employees = employees;
			$scope.sortC = sortC;
			function sortAZ(){
				sortC = true;
			}
		}
	);
