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
    preboil: 1.052,
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

  $scope.malt = $scope.dme[0];
  console.log($scope.malt);


  $scope.$watchCollection('userData', function(user){
    //console.log(user);

    if( (user.targetGravity !== null || user.targetGravity !== undefined ) && user.collected !== null && user.batchSize !== null){
      // Calculate Gravity Units
      $scope.calculated.gu = returnGU(user.targetGravity);
      
      // Calculate Total Gravity Units - Calculated Gravity Units * Batch Size
      $scope.calculated.totalGu = $scope.calculated.gu * user.batchSize;
     // console.log($scope.calculated.totalGu);
      // Calculate Target Preboil
      var targetPre = Math.round($scope.calculated.totalGu / user.collected);
      targetPre     = (targetPre < 100) ? 
                                    targetPre / 1000
                                   : targetPre / 100;
      targetPre     = targetPre.toString();
      var target = targetPre.substring(2, targetPre.length);
      $scope.calculated.targetPreBoil = '1.' + target;
    }



    // Look at preboil and temp of reading to calculate 
    if(user.preboil !== undefined && user.readingTemp !== undefined) {
        //user.preboilGravity = $scope.calculated.targetPreBoil - $scope.tempAdj
        var preboil = user.preboil;
        var temp    = user.readingTemp;

        for(var i=0; i<$scope.tempAdj.length; i++){
          //console.log($scope.tempAdj[i].temp);
          if($scope.tempAdj[i].temp === temp){
            var adj = $scope.tempAdj[i].adj;
            break;
          }
        }

        $scope.calculated.actualReading = parseInt($scope.calculated.targetPreBoil) + adj; 
        user.preboilGravity  = user.preboil + adj;
       
        // calculate GU's short per gal
        var preGu = returnGU(user.preboilGravity);
        var preGuShort = preGu * user.collected;

        // calculate estimated FG
        $scope.calculated.estimatedFG = ((preGuShort / user.batchSize) / 1000) + 1;

        // finish calculated GU's short
        preGuShort = $scope.calculated.totalGu - preGuShort;
        preGuShort = preGuShort / user.batchSize;
        $scope.calculated.guShort = preGuShort;


        // Calculate DME addition
        $scope.calculated.dmeAdd = calcDmeAdd();

    }

  });


  // --- ng-change for selecting what dry malt extract --- \\
  $scope.dmeSelection = function(){
    if($scope.userData.preboil !== undefined && $scope.userData.readingTemp !== undefined) {
       $scope.calculated.dmeAdd = calcDmeAdd();
    }
  }


  /* --- Calculate Dry Malt Extract Addition --- \\ 
   * (x * ppg / batch size) = gravity units short per gal
   */
  function calcDmeAdd(){
    // ((x in lbs) * (44ppg (Muntons Light)) / (5 batch size) = 11 // 11 is your guShort per gal

    if($scope.userData.preboil !== undefined && $scope.userData.readingTemp !== undefined) {
      return   ($scope.calculated.guShort * $scope.userData.batchSize / $scope.malt.ppg).toFixed(2);
    }
    return null;
  }

};


function returnGU(gravity) {
  // Send gravity to returnGU to return the Gravity units (removing 1.0, or 1.)
  gravity   = gravity.toFixed(3).toString();
  var guPos = gravity.indexOf("1.0");

  return guPos !== -1 ? 
                          parseInt(gravity.substring(guPos+3, gravity.length))
                      :
                          parseInt(gravity.substring(2, gravity.length)); 
}

