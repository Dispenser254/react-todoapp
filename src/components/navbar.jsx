import React, {useState} from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler, MDBBtn, MDBCollapse, MDBIcon, MDBInputGroup } from "mdb-react-ui-kit";

export default function NavBar() {
    const [showNavBar, setShowNavBar] = useState(false);

    return(
        <>
        <MDBNavbar expand='lg' bgColor='light'>
            <MDBContainer fluid>
                <MDBNavbarBrand href='#'>ToDo App</MDBNavbarBrand>
                <MDBNavbarToggler type='button' data-target='#navbarToggle' aria-controls='navbarToggle' aria-expanded='false' 
                aria-label='Toggle navigation' onClick={() => setShowNavBar(!showNavBar)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>

                <MDBCollapse navbar show={showNavBar}>
                    <MDBNavbarNav className='mr-auto mb-lg-0'>
                        <MDBNavbarItem>
                            <MDBNavbarLink active aria-current='page' href='#'>
                                Home
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='#'>
                                About
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='#'>
                                Info
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>

                    <MDBInputGroup tag="form" className='d-flex w-auto'>
                        <input className='form-control' placeholder='Search...' aria-label='Search' type='Search' />
                        <MDBBtn outline>Search</MDBBtn>
                    </MDBInputGroup>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
        </>
    );
}