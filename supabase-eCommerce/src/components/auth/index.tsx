import {useState, type ChangeEvent, type FormEvent } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import {supabase} from "../../supabase-client";
import "./styles.css"

export default function Auth(){
    //Guarda o valor para poder fazer a alternância entre as abas de cadastro de login
    const [hasAccount, setHasAccount] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setNewError] = useState<string>("");
    const [verifyEmail, sendVerifyEmail] = useState<boolean>(false);

    //Função executada ao submeter o formulário
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Verifica se é para criar uma conta ou se é para logar, e executa a função própria
        if(!hasAccount){
            // CADASTRO
            const {error} = await supabase.auth.signUp({email, password});
            if(error){
                setNewError(`Erro ao realizar cadastro: ${error.message}`);
                return
            }
            sendVerifyEmail(true);
        }else{
            // LOGIN
            const {error} = await supabase.auth.signInWithPassword({email, password});
            if(error){
                setNewError(`Erro ao realizar login: ${error.message}`)
                return
            }
        }
    }

    // RENDERIZAÇÃO DA PÁGINA
    return(
        /*Mesmos componentes, muda somente os textos escritos para corresponder à login ou cadastro */
        <div className="authentication">
            <h2>{hasAccount? "Entrar" : "Cadastrar"}</h2>
            <form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <Form.Control
                    placeholder="Email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <Form.Control
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Senha"
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                    />
                </InputGroup>
                <span className='displayErrors'>{errorMessage}</span>
                <span className='verifyEmail'>{verifyEmail ? "Foi enviado um link de verificação para o email fornecido. Verifique sua caixa de entrada" : ""}</span>
                <Button type="submit" variant="primary">{hasAccount? "Entrar" : "Cadastrar"}</Button>
            </form>
            <a href="#" type="button" onClick={() => {setHasAccount(!hasAccount); setNewError("")}}>{hasAccount? "Não possuo conta" : "Já possuo uma conta"}</a>
        </div>
    );
}