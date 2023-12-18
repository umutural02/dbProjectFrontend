import PageContent from "./PageContent"
import LeftSidebar from "./LeftSidebar"
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout"

function Layout(){

    return(
      <>
        { /* Left drawer - containing page content and side bar (always open) */ }
        <div className="drawer drawer-mobile">
            <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            <PageContent/>
            <LeftSidebar/>
        </div>

      {/* Modal layout container */}
        <ModalLayout />

      </>
    )
}

export default Layout