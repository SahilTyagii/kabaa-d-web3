import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import navHeader from './navHeader.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="light" data-bs-theme="light">
            <Container>
                <Navbar.Brand href="#">
                    <img src={navHeader} width="240" height="60" className="" alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
                        <Nav.Link as={Link} to="/create">Sell</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Scraps</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="success">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="success">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;