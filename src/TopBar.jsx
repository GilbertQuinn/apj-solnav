/* eslint-disable */
//Close the detail view
import logo from './assets/aws_smile-header-desktop-en-white_59x35.png'
import TopNavigation from "@cloudscape-design/components/top-navigation";

function TopBar(props) {

    const adminClick = () => {
      console.log("AdminClick")
      props.setAdmin(true)
    };

    //Return a json object list of resources for the topnav items from props.resources
    function resourceLinks(resources) {
        const resourceLinks = [];
        for (let i = 0; i < resources.length; i++) {
          resourceLinks.push({ id: resources[i].id, text: resources[i].name, href: resources[i].url, external: true })
        }
        resourceLinks.push({
          id: 0,
          text: "Admin",
          href: window.location.href + "?admin=true"
        })
        return resourceLinks;
    }

    return (

      <TopNavigation
      identity={{
        href: "#",
        title: "APJ Solutions Navigator",
        logo: {
          src: logo,
          alt: "AWS"
        }
      }}
      utilities={[
        {
          type: "menu-dropdown",
          text: "AWS / Partner Solutions Resources",
          items: resourceLinks(props.resources)
        }
      ]}
    />
        
    )
  }
  
export default TopBar