import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

import logo from '../../assets/frontend_assets/bite.svg'
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <hr />
      <div className="footer-content">
        <div className="footer-content-left">
          <div className="logo-container">
          <img src={logo} alt="" className="logo"/>
          </div>
          
          <p>
            This app was handmade by me, Anders Choo, with my own two hands. 
            </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2 className="yay">Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2 className="yay">Get in touch</h2>
          <ul>
            <li>+65 86838529</li>
            <li>anderschoozq@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 @ Anders Choo - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
