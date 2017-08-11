// var rules_basic = {
//   condition: "AND",
//   rules: [
//     {
//       id: "price",
//       operator: "less",
//       value: 10.25
//     },
//     {
//       condition: "OR",
//       rules: [
//         {
//           id: "category",
//           operator: "equal",
//           value: 2
//         },
//         {
//           id: "category",
//           operator: "equal",
//           value: 1
//         }
//       ]
//     }
//   ]
// };

$("#builder").queryBuilder({
  plugins: ["bt-tooltip-errors"],

  filters: [
    {
      id: "CONCEPT_CD",
      label: "Disease code",
      type: "string",

      operators: [
        "equal",
        "not_equal"
      ]
    },
    // {
    //   id: "in_stock",
    //   label: "In stock",
    //   type: "integer",
    //   input: "radio",
    //   values: {
    //     1: "Yes",
    //     0: "No"
    //   },
    //   operators: ["equal"]
    // },
    {
      id: "AGE_IN_YEARS_NUM",
      label: "AGE",
      type: "integer",
      validation: {
        min: 0,
        step: 1
      }
    }
    ,
    // {
    //   id: "id",
    //   label: "Identifier",
    //   type: "string",
    //   placeholder: "____-____-____",
    //   operators: ["equal", "not_equal"],
    //   validation: {
    //     format: /^.{4}-.{4}-.{4}$/
    //   }
    // }
  ],
  // rules: rules_basic
});
/****************************************************************
                Triggers and Changers QueryBuilder
 *****************************************************************/

$("#btn-get").on("click", function() {
  var result = $("#builder").queryBuilder("getMongo");
  if ($.isEmptyObject(result)) {
    console.log("invalid object :");
  } 

  console.log(result);

  queryValue = JSON.stringify(result, null, 2)

  localStorage.setItem("query", queryValue);

   //window.location.href = "../index.html";

  location.href = Flask.url_for("dashboard");

  console.log(String(result));
});

$("#btn-reset").on("click", function() {
  $("#builder").queryBuilder("reset");
});

// $("#btn-set").on("click", function() {


//   console.log(localStorage.getItem("query"));

//   var value;


//   $.get(Flask.url_for("donorschoose_projects", {query:localStorage.getItem("query")}), function(data) {
       
//       // value = data

//       console.log(data);

//       value = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

//       localStorage.setItem("downloadVal", value);



//       //var dlAnchorElem = document.getElementById("btn-group").getElementsByTagName("#btn-set");


//       // $("#btn-set").setAttribute("href", value);

//       // $("#btn-set").setAttribute("download", "scene.json");


//       // el.setAttribute("href", value);
//       // el.setAttribute("download", "data.json");
//     }

//     );



//   //console.log(value)

  



// });


  function exportJson(el) {

    console.log(localStorage.getItem("query"));

    var value;

    // var obj = {
    //     a: 123,
    //     b: "4 5 6"
    // };
    // var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(value));
    // what to return in order to show download window?



     $.get(Flask.url_for("donorschoose_projects", {query:localStorage.getItem("query")}), function(data) {
       
      // value = data

      //console.log(data);

      value = "text/json;charset=utf-8," + encodeURIComponent(data);

      //localStorage.setItem("downloadVal", value);

      console.log(value)



      //var dlAnchorElem = document.getElementById("btn-group").getElementsByTagName("#btn-set");


      // $("#btn-set").setAttribute("href", value);

      // $("#btn-set").setAttribute("download", "scene.json");


      el.setAttribute("href", "data:"+value);
      el.setAttribute("download", "data.json");


    }

    );

   


    
}

// $("#btn-set").on("click", function() {
//   //$('#builder').queryBuilder('setRules', rules_basic);
//   var result = $("#builder").queryBuilder("getRules");
//   if (!$.isEmptyObject(result)) {
//     rules_basic = result;
//   }
// });

//When rules changed :
$("#builder").on("getRules.queryBuilder.filter", function(e) {
  //$log.info(e.value);
});