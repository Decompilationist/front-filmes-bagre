import React, { useState, useContext, useEffect } from 'react';
import {Button, Modal, Form, Col, Row, Accordion, Alert, ToggleButton } from 'react-bootstrap/';
import { FormWrapper } from './paymentForm.styles';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function RegisteredPaymentForm(props) {
    
    let seat_id = props.seat_id;


    const { getRefundByUser, makePayment, processTicket, getOneSeat } = useContext(MovieAPIContext);
    const [ showModal, setShow ] = useState(false);
    const [ userCredit, setUserCredit ] = useState([])
    const [ creditAlertState, setCreditAlertState ] = useState("success");
    const [ enableCreditButton, setCreditButton ] = useState(true);
    const [ fname, setFname ] = useState();
    const [ lname, setLname ] = useState();
    const [ cc_number, setCardNumber ] = useState();
    const [ ticket_id, setTicket ] = useState();
    const [ refund, setRefund ] = useState([]);
    const [ applyRefund, setApplyRefund ] = useState(false);
    const [ paymentSuccess, setPaymentSuccess ] = useState(null)
    const [ ticketConfirmation, setTicketConfirmation ] = useState(null);
    const [ payEnabled, setPayEnabled ] = useState(true);
    const [ seat_cost, setSeatDetails] = useState();
    const [ useOther, setUseOtherCreditCard] = useState(false);


    useEffect(() => {
        async function updateRefundsForUser() {
            try{
                const users_credit = await getRefundByUser();
                setUserCredit(users_credit);
                if(users_credit[0] === false) {
                    setCreditAlertState("danger"); 
                    setCreditButton(false);
                }
                else if(users_credit[1] === 0) {
                    setCreditAlertState("warning")
                    setCreditButton(false);
                }
                else {
                    setCreditAlertState("success"); 
                    setCreditButton(true);
                }
            } catch (e){
                console.log("error")
            }
            
        };
        updateRefundsForUser();
        
    }, []);

    useEffect(() => {
        async function getSeatCost() {
            try{
                const seat_details = await getOneSeat(seat_id);
                if(!seat_details) {
                    setSeatDetails("N/A");
                }
                else {
                    setSeatDetails(seat_details.cost);
                }
            } catch (e){
                console.log(e)
            }
        };
    getSeatCost();       
    }, [seat_id]);


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

    const handleReturn = () => {
        handleClose();
        props.handleClose();
    }


    const handleClose = () => {
        setShow(false);
        setFname("");
        setLname("");
        setCardNumber("");
        setTicket("");
        setRefund([]);
        setApplyRefund(false);
        setPaymentSuccess(null);
        setPayEnabled(true);
        setTicketConfirmation(null);
    }
    const handleShow = () => setShow(true);


    const handleSubmit = async (event) => {
        try {
            const payment_result = await makePayment(seat_id, cc_number, ticket_id, applyRefund);
            if(payment_result[0] !== true) throw payment_result[1];
            const ticket_result = await processTicket(seat_id, "", payment_result[1]);
            if(ticket_result[0] !== true) throw ticket_result[1];
            setTicketConfirmation(ticket_result[1]);
            setPaymentSuccess(true);
        } catch (error) {
            setTicketConfirmation(error);
            setPaymentSuccess(false);
        }
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Efetuar pagamento</Button>
            <Modal show={showModal} onHide={handleClose} >
                <Modal.Header>Pagamento</Modal.Header>
                <Modal.Body>
                    {paymentSuccess === true ? (
                        <Alert variant="success">
                            <Alert.Heading>Ingresso comprado com sucesso!</Alert.Heading>
                                <p>
                                Aqui está o ID do seu ingresso #: <b>{ticketConfirmation} </b>
                                    Um email de confirmação foi enviado juntamente do recibo.
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleReturn} variant="outline-success">
                                        Voltar
                                    </Button>
                                </div>
                        </Alert>
                    ) : (ticketConfirmation && <Alert variant="danger">
                            <Alert.Heading>Erro ao efetuar pagamento</Alert.Heading>
                            <p>
                                {ticketConfirmation}
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
                                        O custo total é: <b>${seat_cost}</b>.
                                    </p>
                                    <hr />
                            </Alert>
                        {userCredit[0]===true ? (
                            <Alert variant={creditAlertState}>Você tem ${userCredit[1]} de crédito
                            <div className="d-grid gap-2">
                                <ToggleButton
                                    className="mb-2"
                                    id="toggle-check"
                                    type="checkbox"
                                    variant="outline-primary"
                                    checked={applyRefund}
                                    value="1"
                                    disabled = {!enableCreditButton}
                                    onChange={(e) => setApplyRefund(e.currentTarget.checked)}>
                                        Clique para aplicar crédito
                                </ToggleButton>
                            </div>
                            </Alert>     
                        ) : (!refund[0] && <Alert variant={creditAlertState}>Problema ao recuperar seu crédito!</Alert>)}            
                        </Accordion.Item>
                        <Accordion.Item eventkey="1">
                                <Accordion.Header>Use um diferente cartão de crédito</Accordion.Header>
                                <Accordion.Body>
                                <Form.Check
                                    
                                    type='checkbox'
                                    label = 'Usar um diferente cartão de crédito?'
                                    onChange={(e) => setUseOtherCreditCard(e.target.checked)}
                                    />
                                    <FormWrapper onSubmit={handleSubmit}>
                                    <Row>
                                        <Form.Group as={Col} className="mb-3" controlId="fname">
                                            <Form.Label>nome:</Form.Label>
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
                                        <Form.Label>Digite o número cartão de crédito:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            pattern="^[0-9]+$" 
                                            placeholder="XXXX XXXX XXXX XXXX" 
                                            value={cc_number || ""} 
                                            onChange={(e) => setCardNumber(e.target.value)} 
                                            required>
                                        </Form.Control>
                                    </Form.Group> 
                                </FormWrapper>
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