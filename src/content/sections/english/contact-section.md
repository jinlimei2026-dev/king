---
enable: true
badge: "contact"
title: "Have a project in mind? <br /> Let's talk."
description: "Whether you are an independent retail store or a small business seeking a reliable B2B partnership, our dedicated team is prepared to support you with swift responses."
image: "/images/contact-home.jpg"
imageAlt: "Contact"
characterImage: "/images/character-3d.png"
characterImageAlt: "3D character"

form:
  emailSubject: "New B2B Inquiry"
  submitButton:
    enable: true
    label: "Send a Message"
  inputs:
    - label: "Full Name"
      placeholder: "Full Name *"
      name: "Full Name"
      required: true
      halfWidth: true
      defaultValue: ""
    - label: "Company"
      placeholder: "Company Name"
      name: "Company"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Email Address"
      placeholder: "Email Address *"
      name: "Email Address"
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: "Phone Number"
      placeholder: "Phone Number"
      name: "Phone Number"
      required: false
      type: "text"
      halfWidth: true
      defaultValue: ""
    - label: "Subject"
      placeholder: "Inquiry Subject *"
      name: "Subject"
      required: true
      type: "text"
      halfWidth: false
      defaultValue: ""
    - label: "Specific Information"
      tag: "textarea"
      placeholder: "Please describe your requirements in detail... *"
      name: "Message"
      required: true
      halfWidth: false
      rows: "4"
      defaultValue: ""
    - label: "I agree to the [Terms & Conditions](/privacy-policy/)"
      name: "Agreed Privacy"
      value: "Agreed"
      checked: false
      required: true
      type: "checkbox"
      halfWidth: false
      defaultValue: ""
    - note: success
      parentClass: "hidden text-sm message success"
      content: "We have received your message! We'll get back to you as soon as possible."
    - note: deprecated
      parentClass: "hidden text-sm message error"
      content: "Something went wrong! Please try again."
---
