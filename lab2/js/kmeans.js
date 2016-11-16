    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */

    var cluster_array = [];
    var centroids = [];
    var keys = [];
    var new_centroids = [];

    //STEP 1
    function place_centroids(data, k) {
      // body...
      var item = [];
      //console.log(data[0].B);

      for(var i = 0; i < k; i++){
        item[i] = data[Math.floor(Math.random()*data.length)];
      }
      return item;
    }

    //STEP 2
    function calc_distance(point){
      var shortestDist = Infinity;

      var assignedCluster;
      //console.log(centroids.length);

        for (var j = 0; j < centroids.length; j++) {
            var sum = 0;
            keys.forEach(function(dimension){
              var p = Number(point[dimension]);
              var q = Number(centroids[j][dimension]);

              sum += Math.pow(q-p, 2);
            });

            sum = Math.sqrt(sum);

            if(sum < shortestDist){
              shortestDist = sum;
              assignedCluster = j;
            }
        }

          return assignedCluster;
    }

    //STEP 3
    function recalc_centroid(data, k) {

      var temp = [];

      for (var i = 0; i < centroids.length; i++) {
        var count = 0;
        var point = {};

        keys.forEach(function(dimension){
          var avg = 0;

          for (var j = 0; j < data.length; j++) {
            if(cluster_array[j] == i){

              avg+= Number(data[j][dimension]);
              count++;
            }
          }

          point[dimension] = avg/count;

        });
        temp.push(point);
      }
      return temp;
    }

    //STEP4
    function checkQuality(data, k) {
      var sumMin = 0;

      for (var i = 0; i < centroids.length; i++) {
        var minError = 0;
        for (var j = 0; j < data.length; j++) {

          if(cluster_array[j] == i){
              keys.forEach(function(dimension){

                var x =  Number(data[j][dimension]);
                var my = Number(centroids[i][dimension]);
                minError = Math.pow((x-my), 2);
            });

            sumMin += minError;
          }

        }

      }
      //console.log("SUMMIN", sumMin);
      return sumMin;
    }

    function kmeans(data, k) {

      keys = d3.keys(data[0]);
      var quality;
      var oldQuality = 0;
      var qualityDiff = 0;
      var n = 1;

        do {
          //STEP 1 Take out k random 2objects, centroids.
          centroids = place_centroids(data, k);
          //console.log("Random Centroids", centroids);

        //STEP 2 assign
        data.forEach(function(d, i){
          cluster_array[i] = calc_distance(d);
        });

        //STEP 3 recalculate centroid
        centroids = recalc_centroid(data, k);
        //console.log("Calculated Centroids", centroids);

        //STEP 4 check quality
        quality = checkQuality(data, k);
        qualityDiff = Math.abs(oldQuality-quality);
        oldQuality = quality;
        n++;
        console.log("KValite", qualityDiff);

      }while(qualityDiff > 0.1);

      return cluster_array;

    };
