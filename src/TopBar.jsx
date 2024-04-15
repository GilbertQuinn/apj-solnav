  //Close the detail view
import logo from './assets/aws_smile-header-desktop-en-white_59x35.png'

function TopBar() {
 
    return (
      
      <div className="topbar">
        <img src={logo} alt="logo" className="topbar-image" />
        <div>
            <h1 className="topbar-title">
              APJ Solutions Navigator<br/>
              <sub><a href="https://aws.highspot.com/spots/66045e3bc0af152ea03fbd50" target="_blank">(SA G5 Solutions Adoption on Highspot)</a></sub>
            </h1>
            
        </div>
      </div>
  
    )
  }
  
export default TopBar