  <!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body style="background: url('https://static.pexels.com/photos/159788/cup-of-tea-book-table-reading-159788.jpeg') no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;">
      <!--Import jQuery before materialize.js-->
      <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
      <!-- Nav Bar -->
      <nav>
        <div class="nav-wrapper cyan darken-2">
          <a href="#" class="brand-logo">QuickBooks</a>
          <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
          <ul class="right hide-on-med-and-down">
            <li><div class="row">
           
              <div class="row">
                <div class="input-field col s5 cyan">
                  <input placeholder="Username" id="user_name" type="text" class="validate" required>
                  <label for="user_name">Username</label>
                </div>
                <div class="input-field col s5 offset-s1 cyan">
                  <input id="password" type="password" class="validate" required>
                  <label for="password">Password</label>
                </div>
                </li>
            <li><a href="" class="waves-effect waves-teal btn-flat">Login</a></li>
          </ul>
          <ul class="side-nav" id="mobile-demo">
            <li><a href="sass.html">Sass</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">Javascript</a></li>
            <li><a href="mobile.html">Mobile</a></li>
          </ul>
        </div>
  </nav>
  <!-- End of Nav Bar-->
  <script>
  
  // Javascript and Jquery Code Goes Here
  
  // Ajax Post Here
    // Post to Url Login.jsp
    
  
  // Intialisation
          $(".button-collapse").sideNav();
  </script>
    </body>
  </html>