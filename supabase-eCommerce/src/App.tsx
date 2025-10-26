import { useState, useEffect } from "react";
import Auth from "./components/auth/"
import ViewProducts from "./components/viewProducts/"
import { Button, Container, Navbar } from "react-bootstrap";
import { supabase } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";

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
    <>
    <Navbar>
        <Container>
          <Navbar.Brand><img src="/supabase-logo-icon.svg"/></Navbar.Brand>
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
      {session 
      ? (<ViewProducts/>) 
      : (<Auth/>)}
    </div>
    </>
  )
}

export default App
