import Event from "./Event";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { get, add as addEvent, update as updateEvent, del as deleteEvent } from "../services/eventServices";

function Events() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams({});
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
  });

  useEffect(() => {
    fetchEvents();
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  }, []);

  const fetchEvents = async () => {
    try {
      const result = await get();
      setEvents(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  const addNewEvent = async () => {
    try {
      const result = await addEvent(newEvent);
      setEvents([...events, result.data]);
      setNewEvent({
        name: "",
        date: "",
        // Reset other properties
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateExistingEvent = async (eventId, updatedEvent) => {
    try {
      await updateEvent(eventId, updatedEvent);
      setEvents(events.map(event => (event.id === eventId ? updatedEvent : event)));
    } catch (error) {
      console.log(error);
    }
  }

  const deleteExistingEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.log(error);
    }
  }

  const handleBuy = (event) => {

    const updatedEvent = {
      ...event,
      nbTickets: event.nbTickets - 1,
      nbParticipants: event.nbParticipants + 1,
    };
    updateExistingEvent(event.id, updatedEvent);
  }

  const handleDelete = (eventId) => {
    deleteExistingEvent(eventId);
  }

  return (
    <Container>
      <Row>
        {showWelcome && <Alert variant="success">Hey welcome to ESPRIT events</Alert>}
        <Col md={4}>
          <Form>
            <Form.Group controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="eventDate">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={addNewEvent}>
              Add Event
            </Button>
          </Form>
        </Col>
        {events.map((element, index) => (
          <Col key={index} md={4}>
            <Event event={element} onBuy={() => handleBuy(element)} onDelete={() => handleDelete(element.id)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Events;
