import React from 'react'; 
import {BrowserRouter as Router, Link} from 'react-router-dom';


const HomePage = () =>{
    return (
        <div>
            <h1 style={{textAlign: "center"}}>Home page</h1>
            <Router>
            <div style={{textAlign: "center", justifyContent: "center"}} >
                <h4>Filmes</h4>
                <Link to="/movies">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Orphan_First_Kill.png"
                    alt="example"
                />
                </Link>

                <br />
                <br />
                <Link to ="/cancel">
                <h4>Cancelar um ingresso</h4>
                </Link>
            </div>
            </Router>


        </div>
        
    )
}

export default HomePage;