import React, { useState, useContext, useEffect } from 'react';
import {Button, Modal, Form, Col, Row, Accordion, Alert} from 'react-bootstrap/';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function MembershipPaymentForm(props) {

    const { payMembershipFee } = useContext(MovieAPIContext);
    const [ showModal, setShow ] = useState(false);
    const [ fname, setFname ] = useState();
    const [ lname, setLname ] = useState();
    const [ cc_number, setCardNumber ] = useState();
    const [ paymentSuccess, setPaymentSuccess ] = useState(null)
    const [ paymentConfirmation, setPaymentConfirmation ] = useState(null);
    const [ payEnabled, setPayEnabled ] = useState(true);
    const [ useOther, setUseOtherCreditCard ] = useState(false);
    const [ expirationDate, setExpirationDate ] = useState(null);

    useEffect(() => {
        if(!useOther) setPayEnabled(true);
        else if(useOther && fname && lname && validateInputs())
            setPayEnabled(true);
        else {
            setPayEnabled(false);
        }
    });

    function validateInputs(){
        const reg1 = /^\d{16}$/i;
        if(reg1.test(cc_number)){
            return true;
        }
        return false;
    }

    const handleClose = () => {
        setShow(false);
        setFname("");
        setLname("");
        setCardNumber("");
        setPaymentSuccess(null);
        setPayEnabled(true);
        setPaymentConfirmation(null);
        props.helper(true);
    }

    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        try {
            const payment_result = await payMembershipFee(cc_number);
            if(payment_result[0] !== true) throw payment_result[1];
            setPaymentConfirmation(payment_result[1].payment_id);
            setExpirationDate(formatDate(payment_result[1].new_expiry_date));
            setPaymentSuccess(true);
        } catch (error) {
            setPaymentConfirmation(error);
            setPaymentSuccess(false);
        }
    }

    function formatDate(date_time){
        const date = new Date(date_time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [year, month, day].join('/');
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Pagar taxa de membro Bagre Movie</Button>
            <Modal show={showModal} onHide={handleClose} >
                <Modal.Header>Pagamento</Modal.Header>
                <Modal.Body>
                    {paymentSuccess === true ? (
                        <Alert variant="success">
                            <Alert.Heading>Membro Bagre Movie renovado!</Alert.Heading>
                                <p>
                                Sua associação é renovada até <b>{expirationDate}</b>.
                                </p>
                                    <hr />
                                <p>
                                Aqui está o recibo#: <b>{paymentConfirmation}</b>. 
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleClose} variant="outline-success">
                                        Voltar
                                    </Button>
                                </div>
                        </Alert>
                    ) : (paymentConfirmation && <Alert variant="danger">
                            <Alert.Heading>Erro ao efetuar pagamento</Alert.Heading>
                            <p>
                                {paymentConfirmation}
                            </p>
                            <div className="d-flex justify-content-end">
                                <Button onClick={handleClose} variant="outline-danger">
                                    Voltar
                                </Button>
                            </div>
                        </Alert>
                    )}
                    {paymentSuccess === true ? ( 
                        <div></div>
                     ) : (
                    <Accordion defaultActiveKey={['0']}>
                    <Accordion.Item eventkey="0">
                            <Alert variant="info">
                                <Alert.Heading>Confira:</Alert.Heading>
                                    <p>
                                        O custo total é: <b>$20</b>.
                                    </p>
                                    <hr />
                            </Alert>          
                        </Accordion.Item>
                        <Accordion.Item eventkey="1">
                                <Accordion.Header>Use um cartão de crédito diferente</Accordion.Header>
                                <Accordion.Body>
                                <Form.Check
                                    
                                    type='checkbox'
                                    label = 'Usar um cartão de crédito diferente?'
                                    onChange={(e) => setUseOtherCreditCard(e.target.checked)}
                                    />
                                    <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Form.Group as={Col} className="mb-3" controlId="fname">
                                            <Form.Label>Nome:</Form.Label>
                                            <Form.Control 
                                                type="name" 
                                                placeholder="Nome" 
                                                value={fname || ""} 
                                                onChange={(e) => setFname(e.target.value)} 
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-3" controlId="lname">
                                            <Form.Label>Sobrenome:</Form.Label>
                                            <Form.Control 
                                                type="name" 
                                                placeholder="Sobrenome" 
                                                value={lname || ""} 
                                                onChange={(e) => setLname(e.target.value)} 
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="credit_card_number">
                                        <Form.Label>Digite o número do cartão de crédito:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            pattern="^[0-9]+$" 
                                            placeholder="XXXX XXXX XXXX XXXX" 
                                            value={cc_number || ""} 
                                            onChange={(e) => setCardNumber(e.target.value)} 
                                            required>
                                        </Form.Control>
                                    </Form.Group> 
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                )}
                </Modal.Body>
                {paymentSuccess === true ? ( 
                        <div></div>
                     ) : (
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        type="reset" 
                        onClick={handleClose}>
                            Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={!payEnabled}>
                            Pagar
                    </Button>
                </Modal.Footer>
            )}
            </Modal>
        </div>
    )

}