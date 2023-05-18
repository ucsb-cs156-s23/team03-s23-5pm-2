import React from 'react';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const BookForm = ({initialContents, submitAction, buttonLabel = "Create"}) => {
    const navigate = useNavigate();

    // Stryker disable all
    const {
        register, 
        formState: { errors },
        handleSubmit
    } = useForm({defaultValues: initialContents || {}});
    // Stryker enable all

    const testIdPrefix = "BookForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                     data-testid={testIdPrefix + "-id"}
                     id="id"
                     type="text"
                     {...register("id")}
                     value={initialContents.id}
                     disabled
                    />
                </Form.Group>
            )
            }
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-title"}
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-description"}
                    id="description"
                    as="textarea"
                    style={{height:'8rem'}}
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Description is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="author">Author</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-author"}
                    id="author"
                    type="text"
                    isInvalid={Boolean(errors.author)}
                    {...register("author", {
                        required: "Author is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.author?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="date">Date</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-date"}
                    id="date"
                    type="date"
                    max ={new Date().toISOString().slice(0, 10)}
                    isInvalid={Boolean(errors.date)}
                    {...register("date", {
                        required: "Date is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.date?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="publisher">Publisher</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-publisher"}
                    id="publisher"
                    type="text"
                    isInvalid={Boolean(errors.publisher)}
                    {...register("publisher", {
                        required: "Publisher is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.publisher?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
        </Form>
    );
}

export default BookForm;