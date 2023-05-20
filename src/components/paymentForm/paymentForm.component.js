import React, { useState, useContext, useEffect } from 'react';
import { Button, Modal, Form, Col, Row, Accordion, Alert, ToggleButton } from 'react-bootstrap/';
import { FormWrapper } from './paymentForm.styles';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function PaymentForm(props) {

    let seat_id = props.seat_id;

    const { getRefundByTicket, makePayment, processTicket, getOneSeat } = useContext(MovieAPIContext);
    const [ showModal, setShow ] = useState(false);
    const [ fname, setFname ] = useState();
    const [ lname, setLname ] = useState();
    const [ cc_email, setEmail ] = useState();
    const [ cc_number, setCardNumber ] = useState();
    const [ ticket_id, setTicket ] = useState();
    const [ refund, setRefund ] = useState([]);
    const [ applyRefund, setApplyRefund ] = useState(false);
    const [ paymentSuccess, setPaymentSuccess ] = useState(null)
    const [ ticketConfirmation, setTicketConfirmation ] = useState(null);
    const [ payEnabled, setPayEnabled ] = useState(false);
    const [ seat_cost, setSeatDetails] = useState();


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
        if(fname && lname && validateInputs())
            setPayEnabled(true);
    });

    function validateInputs(){
        const reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        const reg1 = /^\d{16}$/i;
        if(reg.test(cc_email) && reg1.test(cc_number)){
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
        setEmail("");
        setCardNumber("");
        setTicket("");
        setRefund([]);
        setApplyRefund(false);
        setPaymentSuccess(null);
        setPayEnabled(false);
        setTicketConfirmation(null);
    }
    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        try {
            const payment_result = await makePayment(seat_id, cc_number, ticket_id, applyRefund);
            if(payment_result[0] !== true) throw payment_result[1];
            const ticket_result = await processTicket(seat_id, cc_email, payment_result[1]);
            if(ticket_result[0] !== true) throw ticket_result[1];
            setTicketConfirmation(ticket_result[1]);
            setPayEnabled(false);
            setPaymentSuccess(true);
        } catch (error) {
            setTicketConfirmation(error);
            setPaymentSuccess(false);
        }
    }

    const handleRefund = async (e) => {
        const result = await getRefundByTicket(ticket_id);
        setRefund(result);
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
                                    {/* nodemailer fetch na rota /api/v1/users */}
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleReturn} variant="outline-success">
                                        Retornar
                                    </Button>
                                </div>
                        </Alert>
                    ) : (ticketConfirmation && <Alert variant="danger">
                            <Alert.Heading>Erro</Alert.Heading>
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
                                <FormWrapper onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Col} className="mb-3" controlId="fname">
                                        <Form.Label>Primeiro Nome:</Form.Label>
                                        <Form.Control 
                                            type="name" 
                                            placeholder="Primeiro nome" 
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
                                <Form.Group className="mb-3" controlId="cc_email">
                                    <Form.Label>E-mail:</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="email" 
                                        value={cc_email || ""} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required>
                                    </Form.Control>
                                </Form.Group>
                                
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
                                
                            </FormWrapper>
                        </Accordion.Item>
                        <Accordion.Item eventkey="1">
                            <Accordion.Header>Pagar com Reembolso</Accordion.Header>
                            <Accordion.Body>
                                <FormWrapper >
                                    <Form.Group className="mb-3" controlId="refund_num">
                                        <Form.Label>Número de Reembolso do Ingresso:</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Número do Ingresso Associado ao Reembolso"
                                            value={ticket_id || ""}
                                            onChange={(e) => setTicket(e.target.value)}>
                                        </Form.Control>
                                        <div className="d-grid gap-2">
                                            <Button 
                                                variant="primary"
                                                size="sm"
                                                onClick={handleRefund}>
                                                    Obter Reembolso
                                            </Button>
                                        </div>
                                        
                                        {refund[0]===true ? (
                                            <Alert variant="success">Você tem ${refund[1]} de credito
                                            <ToggleButton
                                                className="mb-2"
                                                id="toggle-check"
                                                type="checkbox"
                                                variant="outline-primary"
                                                checked={applyRefund}
                                                value="1"
                                                onChange={(e) => setApplyRefund(e.currentTarget.checked)}>
                                                    Clique para aplicar os créditos
                                            </ToggleButton>
                                        </Alert>     
                                        ) : (refund[1] && <Alert variant="danger">{refund[1]}</Alert>)}
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