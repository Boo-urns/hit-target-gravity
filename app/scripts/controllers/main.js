'use strict';

 angular.module('hitTargetGravityApp', ['ngRoute'])
  .config(function($routeProvider) {
  	$routeProvider
  		.when('/', {
  			templateUrl: 'views/main.html',
        controller: 'MainCtrl'
  		});
  });


function MainCtrl ($scope) {

  $scope.userData = {};
  $scope.calculated = {};

  // Setting up a default for now
  $scope.userData = {
    targetGravity: 1.080,
    collected: 6.5,
    batchSize: 5,
    preboil: 1.040,
    readingTemp: 90
  }

  $scope.tempAdj =  [
    {temp: 80, adj: .002},
    {temp: 90, adj: .004},
    {temp: 100, adj: .006},
    {temp: 110, adj: .008},
    {temp: 120, adj: .010},
    {temp: 130, adj: .013},
    {temp: 140, adj: .016},
    {temp: 150, adj: .018},
    {temp: 160, adj: .022},
    {temp: 170, adj: .025},
    {temp: 180, adj: .029},
    {temp: 190, adj: .033},
    {temp: 200, adj: .036},
    {temp: 212, adj: .040}
  ];
  
  // for(var i = 1, j=80, adj=.002; j <= 220; j+=10, i++){
  //   $scope.tempAdj[i] = { temp: j, adj: adj };
    
  //   if(j <= 120) {
  //     adj = adj + .002;
  //   }
  //   else if(j > 120) {
  //     adj = adj + .003;
  //   }
  //   adj = adj + .002;
  // }
  // console.log($scope.tempAdj);
  // $scope.tempAdj = [
  //   'temp' => 
  // ];

  $scope.dme = [
    {dme: 'Briess Pilsen Light', ppg: 44},
    {dme: 'Briess Golden Light', ppg: 43},
    {dme: 'Muntons Light', ppg: 44},
    {dme: 'Muntons Extra Light', ppg: 37}
  ];



  $scope.$watchCollection('userData', function(){
    console.log($scope.userData);

    if( ($scope.userData.targetGravity !== null || $scope.userData.targetGravity !== undefined ) && $scope.userData.collected !== null && $scope.userData.batchSize !== null){
      // Calculate Gravity Units
      var targetStr = $scope.userData.targetGravity.toFixed(3).toString();
      
      var guPos = targetStr.indexOf("1.0");
      $scope.calculated.gu = guPos !== -1 ? 
                              parseInt(targetStr.substring(guPos+3, targetStr.length))
                              : parseInt(targetStr.substring(2, targetStr.length));

      // Calculate Total Gravity Units
      // - Calculated Gravity Units * Batch Size
      $scope.calculated.totalGu = $scope.calculated.gu * $scope.userData.batchSize;

      // Calculate Target Preboil
      var targetPre = Math.round($scope.calculated.totalGu / $scope.userData.collected);
      targetPre     = (targetPre < 100) ? 
                                    targetPre / 1000
                                   : targetPre / 100;
      targetPre     = targetPre.toString();
      var target = targetPre.substring(2, targetPre.length);
      $scope.calculated.targetPreBoil = '1.' + target;
    }

    console.log($scope.calculated);


    // Look at preboil and temp of reading to calculate 
    if($scope.userData.preboil !== undefined && $scope.userData.readingTemp !== undefined) {
        //$scope.userData.preboilGravity = $scope.calculated.targetPreBoil - $scope.tempAdj
        var preboil = $scope.userData.preboil;
        var temp    = $scope.userData.readingTemp;

        for(var i=0; i<$scope.tempAdj.length; i++){
          console.log($scope.tempAdj[i].temp);
          if($scope.tempAdj[i].temp === temp){
            var adj = $scope.tempAdj[i].adj;
            break;
          }
        }

        $scope.calculated.actualReading = $scope.calculated.targetPreBoil - adj; 
        $scope.userData.preboilGravity  = $scope.userData.preboil - adj;
       
        //console.log($scope.tempAdj.temp[$scope.userData.readingTemp]);

    }

  });
};