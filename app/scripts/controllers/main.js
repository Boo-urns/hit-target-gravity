'use strict';

angular.module('hitTargetGravityApp', ['ngRoute']).config(function($routeProvider) {
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
    $scope.userData = {readingTemp: 70};

    $scope.tempAdj =  [
			  {temp: 70, adj: 0},
        {temp: 80, adj: 0.002},
        {temp: 90, adj: 0.004},
        {temp: 100, adj: 0.006},
        {temp: 110, adj: 0.008},
        {temp: 120, adj: 0.010},
        {temp: 130, adj: 0.013},
        {temp: 140, adj: 0.016},
        {temp: 150, adj: 0.018},
        {temp: 160, adj: 0.022},
        {temp: 170, adj: 0.025},
        {temp: 180, adj: 0.029},
        {temp: 190, adj: 0.033},
        {temp: 200, adj: 0.036},
        {temp: 212, adj: 0.040}
    ];



    $scope.dme = [
        {dme: 'Briess Pilsen Light', ppg: 44},
        {dme: 'Briess Golden Light', ppg: 43},
        {dme: 'Muntons Light', ppg: 44},
        {dme: 'Muntons Extra Light', ppg: 37}
    ];


    // initialize default value for reading temp and malt
    $scope.readingTemp = $scope.tempAdj[0];
    $scope.malt = $scope.dme[0];



    $scope.$watchCollection('userData', function(user){

        if( user.targetGravity && user.collected && user.batchSize ){
            // Calculate Gravity Units
            $scope.calculated.gu = returnGU(user.targetGravity);

            // Calculate Total Gravity Units - Calculated Gravity Units * Batch Size
            $scope.calculated.totalGu = $scope.calculated.gu * user.batchSize;

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
        if(user.preboil && user.readingTemp) {
            //user.preboilGravity = $scope.calculated.targetPreBoil - $scope.tempAdj
            var preboil = user.preboil,
                temp    = user.readingTemp,
                adj;

            for(var i=0; i<$scope.tempAdj.length; i++){
                if($scope.tempAdj[i].temp === temp){
                    adj = $scope.tempAdj[i].adj;
                    break;
                }
            }


            $scope.calculated.actualReading = parseFloat($scope.calculated.targetPreBoil) + adj;
            user.preboilGravity  = preboil + adj;

            // calculate GU's short per gal
            var preGu = returnGU(user.preboilGravity);
            var preGuShort = preGu * user.collected;

            // calculate estimated OG
            $scope.calculated.estimatedOG = (((preGuShort / user.batchSize) / 1000) + 1).toFixed(3);

            // finish calculated GU's short
            preGuShort = $scope.calculated.totalGu - preGuShort;
            preGuShort = preGuShort / user.batchSize;
            $scope.calculated.guShort = preGuShort.toFixed(3);


            // Calculate DME addition
            $scope.calculated.dmeAdd = calcDmeAdd();

        }

    });

    // --- ng-change for reading temp --- \\
    $scope.tempSelection = function(){
        $scope.userData.readingTemp = $scope.readingTemp.temp;
    };


    // --- ng-change for selecting what dry malt extract --- \\
    $scope.dmeSelection = function(){
        if($scope.userData.preboil && $scope.userData.readingTemp) {
            $scope.calculated.dmeAdd = calcDmeAdd();
        }
    };


    /* --- Calculate Dry Malt Extract Addition --- \\
     * (x * ppg / batch size) = gravity units short per gal
     */
    function calcDmeAdd(){
      // ((x in lbs) * (44ppg (Muntons Light)) / (5 batch size) = 11 // 11 is your guShort per gal

        if($scope.userData.preboil && $scope.userData.readingTemp) {
            return   ($scope.calculated.guShort * $scope.userData.batchSize / $scope.malt.ppg).toFixed(2);
        }
        return null;
    }

}


function returnGU(gravity) {
    // Send gravity to returnGU to return the Gravity units (removing 1.0, or 1.)
    gravity   = gravity.toFixed(3).toString();
    var guPos = gravity.indexOf('1.0');

    return guPos !== -1 ?
                            parseInt(gravity.substring(guPos+3, gravity.length), 10)
                        :
                            parseInt(gravity.substring(2, gravity.length), 10);
}
