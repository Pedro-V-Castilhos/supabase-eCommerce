import { useState, useEffect } from "react";
import Auth from "./components/auth/"
import ViewProducts from "./components/viewProducts/"
import { Button, Container, Navbar } from "react-bootstrap";
import { supabase } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";
import { BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import ViewOrder from "./components/viewOrder";

function App() {
  // UseState da sessão atual
  const [session, setSession] = useState<Session | null>(null);

  // Atualiza a sessão para corresponder com a atual
  const fetchSession = async () => {
    const curentSession = await supabase.auth.getSession();
    setSession(curentSession.data.session)
  }


  useEffect(() => {
    fetchSession();

    const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })

    return () => {
      authListener.subscription.unsubscribe();
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut();
  }

  return (
    <BrowserRouter>
    <Navbar>
        <Container>
          <Navbar.Brand><img src="/supabase-logo-icon.svg"/></Navbar.Brand>
          <Navbar.Collapse className="justify-content-start">
            {session
              ? (<>
                  <Link to="/viewProducts" className="navbarLink">Catálogo</Link> 
                  <Link to="/order" className="navbarLink">Meu carrinho</Link>
                </>)
              : null
            }
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            {session
              ? <Navbar.Text>
                  <Button id="logoutButton" onClick={() => {logout()}}>Encerrar Sessão</Button>
                </Navbar.Text>
              : <></>
            }
          </Navbar.Collapse>
        </Container>
    </Navbar>
    <div className="app">
      <Routes>
        <Route path="/" element={session ? <Navigate to="/viewProducts" /> : <Navigate to="/authenticate" />}/>
        <Route path="/authenticate" element={session ? <Navigate to="/viewProducts" /> : <Auth/>}/>
        <Route path="/viewProducts" element={session? <ViewProducts/> : <Navigate to="/authenticate"/>}/>
        <Route path="/order" element={session? <ViewOrder/> : <Navigate to="/authenticate"/>}/> 
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
