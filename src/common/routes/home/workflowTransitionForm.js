import React, { Component } from "react";
import Select from 'react-select'
import { Col, Row, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'

class WorkflowTransitionForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formData: {
                ...this.props.formData
            }
        }
        this.workFlowFields = null
        this.fields = null
        this.fieldsKey = null
        this.allowedValues = {}
    }

    handleChange = (event) => {
        if (event.target.name == "selectedTransition") {
            this.fields = this.workFlowFields[event.target.value].fields
            this.fieldsKey = Object.keys(this.fields);
            for (let j = 0; j < this.fieldsKey.length; j++) {
                if (this.fields[this.fieldsKey[j]].type === "array" && this.fields[this.fieldsKey[j]].allowedValues) {
                    this.allowedValues[this.fieldsKey[j]] = []
                    for (let k = 0; k < this.fields[this.fieldsKey[j]].allowedValues.length; k++) {
                        let currVal = this.fields[this.fieldsKey[j]].allowedValues[k]
                        let obj = {};
                        obj.label = currVal
                        obj.value = currVal
                        this.allowedValues[this.fieldsKey[j]].push(obj)
                    }
                }
            }
        }
        let obj = {}
        obj[event.target.name] = event.target.value;
        this.props.handleChange(obj)
        if (event.target.name == "selectedTransition") {
            this.setState({
                ...this.state,
                formData: {
                    ...this.state.formData,
                    [event.target.name]: event.target.value
                }
            })
        } else {
            this.setState({
                ...this.state,
                formData: {
                    ...this.state.formData,
                    [this.state.formData.selectedTransition]: {
                        ...this.state.formData[this.state.formData.selectedTransition],
                        [event.target.name]: event.target.value
                    }
                }
            })
        }
    };

    handleMultiChange = (e, b, c, d) => {
        let values = []
        for (let i = 0; i < e.length; i++) {
            values.push(e[i].value)
        }
        let obj = {};
        obj[b.name] = values;
        this.props.handleChange(obj)
        this.setState({
            ...this.state,
            formData: {
                ...this.state.formData,
                [b.name]: values
            }
        })
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col sm={12}>
                        <Form>
                            <Form.Group controlId="formSelectedTransition">
                                <Form.Row style={{ paddingBottom: "45px" }}>
                                    <Form.Label column sm="4">Project:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="select"
                                            name="selectedTransition"
                                            value={this.state.formData.Project}
                                            onChange={this.handleChange}
                                        >
                                            <option key={"None"} value="None">None</option>
                                            {this.props.formData.transitionNames.map((item) => <option key={item} value={`${item}`}>{item}</option>)}
                                        </Form.Control>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            {this.state.formData.selectedTransition != "" && this.fieldsKey && this.fieldsKey.map((key) =>
                            (
                                <Form.Group key={`form${key}`} controlId={`form${key}`}>
                                    <Form.Row style={{ paddingBottom: "45px" }}>
                                        <Form.Label column sm="4">{this.fields[key].name}:</Form.Label>
                                        <Col sm="8">
                                            {this.fields[key].type === "string" && <Form.Control
                                                as="textarea"
                                                rows="1"
                                                name={`${key}`}
                                                value={this.state.formData[this.state.formData.selectedTransition][key]}
                                                onChange={this.handleChange}
                                            />}
                                            {this.fields[key].type === "option" && <Form.Control
                                                as="select"
                                                name={`${key}`}
                                                value={this.state.formData[this.state.formData.selectedTransition][key]}
                                                onChange={this.handleChange}
                                            >
                                                {this.fields[key].allowedValues && this.fields[key].allowedValues.map((value) => <option key={value} value={`${value}`}>{value}</option>)}
                                            </Form.Control>
                                            }
                                            {this.fields[key].type === "number" && <Form.Control
                                                type="number"
                                                name={`${key}`}
                                                value={this.state.formData[this.state.formData.selectedTransition][key]}
                                                onChange={this.handleChange}
                                            />
                                            }
                                            {
                                                this.fields[key].type === "array" && this.allowedValues[key] &&
                                                <Select
                                                    onChange={this.handleMultiChange}
                                                    defaultValue={this.state.formData[this.state.formData.selectedTransition][key].map((entry) => {
                                                        return { label: entry, value: entry }
                                                    })}
                                                    isMulti
                                                    name={`${key}`}
                                                    options={this.allowedValues[key]}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                />
                                            }
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                            )
                            )}
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default WorkflowTransitionForm;