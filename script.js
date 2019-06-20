//show login page register click
$("#btnSubmit").click(function () {
    $("#loginpage").show();
});

//login and register forms
$('.message a').click(function () {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});

//register
$("#createBtn").click(function () {
    let data = {
        email: $('#exampleInputEmail1-reg').val(),
        password: $('#exampleInputPassword1-reg').val()
    };
    if (data.email != '' && data.password != '') {
        firebase.auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then(function (user) {
                alert("Successfully created user account", user);
                console.log("Successfully created user account", user);
            })
            .catch(function (error) {
                alert('There was an error');
                let errorCode = error.code;
                let errorMessage = error.message;
                alert(errorCode + ' - ' + errorMessage);
            });
    } else {
        alert("You have to fill both fields");
    }
});

//log in
$("#loginBtn").click(function () {
    if ($('#loginEmail').val() != '' && $('#loginPassword').val() != '') {
        let data = {
            emailLoginput: $('#exampleInputEmail1-log').val(),
            passwordLoginput: $('#exampleInputPassword1-log').val()
        };
        let auth = null;
        firebase
            .auth()
            .signInWithEmailAndPassword(data.emailLoginput, data.passwordLoginput)
            .then(function (user) {
                console.log("Authenticated successfully", user.email);
                auth = user;

            })
            .catch(function (error) {
                console.log("Login Failed!", error);
            });
    } else {
        console.log('You have to fill both fields');
    }
});

//Log out
$("#logout").click(function () {
    firebase.auth().signOut().then(function () {
        $("form")[0].reset();
        console.log('Sign-out successful.');
        $("#logout").hide();
    }).catch(function (error) {
        alert('There was an error');
        let errorCode = error.code;
        let errorMessage = error.message;
        alert(errorCode + ' - ' + errorMessage);
    });
});

//State of user
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log("You are now log in as", firebaseUser.email);
        $("#loginpage").hide();
        $("#logout").append('<button id="btnLogout" type="button" class="btn btn-outline-success" style="margin:5px;">Log out</button>');
        console.log("You can now add recipes");
        // $("#addRecipes").appendTo("body").modal('show');
    } else {
        console.log('Not logged in.');
        //$("#logout").hide();
    }
})

//Add recipe
let database = firebase.database();
let ref = database.ref('recipes');
$(document).on("click", "#buttonSaveChanges", function (e) {
    e.preventDefault();
    let data = {
        recipeTitle: $('#exampleInputTitleRecipe').val(),
        ingredients: $('#IngredientsInput').val(),
        howTo: $('#howTo').val(),
        mealType: $(".form-group-mealtype #mealtype:checked").val(),
        worldCuisine: $(".form-group-worldcuisine #worldcuisine:checked").val(),
        //uploadPhoto: $('#uploadPhoto').val(),

    };
    ref.push(data)
    $('#addRecipes').modal('toggle');
});



let allrecipes = [];
$(document).ready(function () {
    fetch("https://recipe-app1.firebaseio.com/recipes/.json", {
        method: 'GET'
    })
        .then((response) => {
            return response.json()
        }).then(result => {

            let keys = [];
            
            keys.push(Object.keys(result));
            
            let flag = 0;
            for (let i = 0; i < keys[0].length; i++) {
                //console.log(result[keys[0][i]]);
                allrecipes.push(result[keys[0][i]]);
            }            
        }).catch(err => {
            console.log(err);
        });
});

//Search for recipe by title
let foundRecipe = [];
$(document).ready(function () {
    $("#btnSearch").click(function () {
        let input =$('#searchInput').val()

        if (input != '') {
            for (const r of allrecipes) {
                let titler=r.recipeTitle.toLowerCase();
                if (titler.includes(input)) {
                    foundRecipe.push(r);
                }
            }
            if (foundRecipe.length > 0) {
                for (const f of foundRecipe) {
                    $("#result").append(`            
                     <div class="card" style="width: 18rem;">
                     <div class="card-body">            
                     <h5 class="card-title">${f.recipeTitle}</h5>
                         </div><ul>                  
                                  <li>Ingredients:${f.ingredients}</li>
                                  <li>How to:${f.howTo}</li>
                                  <li>Meal Type:${f.mealType}</li>
                                  <li>World cuisine:${f.worldCuisine}</li>
                             </ul>         
                         </div>`)
                }
            } else {
                alert("Recipe name not valid");
            }
        } else {
            console.log("enter something");
        }
    });
});


//Dropdown search
let browseRecipe = [];
$(document).ready(function () {
    $('#dropdownMenu a').click(function () {
        let browseText = ($(this).text());
        

        for (const r of allrecipes) {
            if ((r.mealType || r.howTo) === browseText) {
                browseRecipe.push(r);
            }
        }
        if (browseRecipe.length > 0) {
            for (const b of browseRecipe) {
                $("#result").append(`            
            <div class="card" style="width: 18rem;">
            <div class="card-body">
            <h5 class="card-title">${b.recipeTitle}</h5>
            </div><ul>                    
                     <li>Ingredients:${b.ingredients}</li>
                     <li>How to:${b.howTo}</li>
                     <li>Meal Type:${b.mealType}</li>
                     <li>World cuisine:${b.worldCuisine}</li>
                 </ul>         
            </div>`)
            }
        } else {
            alert("There aren't recipes for that search");
        }
    });
});


