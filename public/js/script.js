document.getElementById('header').innerHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shopee Layout</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
      <style>
        /* Top bar styling */
        .top-bar {
          background-color: #FF8C00;
          padding: 10px 20px;
          border-bottom: 2px solid 	#FF7F50;
        }

        .top-bar a {
          color: #F8F8FF;
          margin-right: 30px;
          text-decoration: none;
        }
        .top-bar a i {
           margin-right: 5px;
        }
        .top-bar a:hover {
          color: 	#DCDCDC;
          
        }

     
        .navbar {
          background-color: #FFFFFF;
          padding: 10px 20px;
          box-shadow: 1px 1px orange;
        }

        .navbar .navbar-brand {
          color: orange;
          font-weight: bold;
        }

        .navbar .nav-link {
          color: orange;
          margin-right: 15px;
        }

        .custom-search-bar {
         width: 600px; 
         margin-right : 150px; 

        }

        .btn-orange {
        background-color: #FFA500; 
        color: #fff;        
        transition: background-color 0.3s ease;
        }

        .btn-orange:hover {
        background-color: #cc8400;

        } 
      </style>
    </head>
    <body>
    <div class="top-bar d-flex justify-content-between align-items-center">
    <div>
        <a href="#">Seller Centre</a>
        <a href="#">Download</a>
        <a href="#">Ikuti kami di <i class="bi bi-facebook"></i> <i class="bi bi-instagram"></i></a> 
    </div>
    <div>
        <a href="#"><i class="bi bi-question-circle"></i> Bantuan</a>
        <a href="#" class="me-3"><i class="bi bi-bell"></i> Notifikasi</a> 
        <a href="#"><i class="bi bi-person-circle"></i></a>
    </div>
</div>

<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <i class="bi bi-bag-fill"></i>
            Toko Mikro
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

      
        <div class="collapse navbar-collapse d-flex justify-content-between align-items-center" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
                <li class="nav-item">
                    <a class="nav-link" href="#">Keranjang Belanja</a>
                </li>
            </ul>

          
            <form class="d-flex search-bar" role="search">
                <div class="input-group custom-search-bar">
                    <input type="text" class="form-control" placeholder="Search" aria-label="Search">
                    <button class="btn btn-orange" type="submit">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</nav>
`
