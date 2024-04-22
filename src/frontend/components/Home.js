import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Waste from './Waste management.gif'


function Home() {
    return (
        <div>
            <main className="custom-main">
                <div className="intro">
                    <br />
                    <h2 className="custom-h2">Turning Waste into Wealth, Sustainab<i>ly</i></h2>
                    <p className="custom-p">Elevate waste management with our Web3-based solutions. From EPR to industrial waste, we ensure efficiency and sustainability nationwide. Harnessing blockchain for transparency, we redefine waste management for a greener future.</p>
                    <a href="/explore" className="custom-link custom-button">Begin Kabaa-Diving Today!</a>
                </div>
                <img src={Waste} alt="Kabaa-D Image" className="custom-img" />
            </main>
        </div>
    );
}

export default Home;