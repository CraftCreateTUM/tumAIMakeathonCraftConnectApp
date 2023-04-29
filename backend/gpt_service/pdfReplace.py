from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle, Image, Frame, Spacer, PageBreak
from reportlab.lib import colors
import json
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import datetime
from reportlab.lib.colors import HexColor

name = ""
company = ""
location = ""
codeWordEquipment = ""
descriptionnumber = ""
description = ""
servicenumber = ""
dotlist = ""
jobdescription = ""
date = ""
styles = getSampleStyleSheet()
elements = []

def process_data(data):
    global name, company, location, codeWordEquipment, descriptionnumber, description, servicenumber, dotlist, jobdescription, date
    name = data["name"]
    company = data["company"]
    location = data["location"]
    codeWordEquipment = data["codeWordEquipment"]
    descriptionnumber = data["descriptionnumber"]
    description = data["description"]
    servicenumber = data["servicenumber"]
    dotlist_str = data['dotlist']  # get the string value of 'dotlist'
    dotlist = dotlist_str.split(', ')  # split the string and create a list
    jobdescription = data["jobdescription"]
    date = data["date"]

    

# Set up the document
def createpdf():
    output_file_name = f"{name}_{date}.pdf"
    doc = SimpleDocTemplate(output_file_name, pagesize=letter)
    
    if company == "electrovolt":
        image = "electrovolt.jpg"
    else:
        image = "electrovolt2.jpg"
    img = Image(image, width=150, height=100)
    elements.append(img)

# Add the header
# Add the header
    header_text = "Electro Volt Technician:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{}<br/>Function local description:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{}<br/>Description Equipment Number:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{}".format(name, location, codeWordEquipment, descriptionnumber)
    header = Paragraph(header_text, info_style)
    elements.append(header)

# Add the Electro Volt Technician info
    subheader_text= "Description of the problem / maintenance / inspection<br/>"
    subheader = Paragraph(subheader_text,subheader_style)

    elements.append(subheader)
    description_text = Paragraph(description, text_style)
    elements.append(description_text)

    subheader1_text = "Reason and solution of the problem / accomplished work<br/>"
    subheader1 = Paragraph(subheader1_text, subheader_style)
    elements.append(subheader1)
    reason_text = Paragraph(jobdescription, text_style)
    elements.append(reason_text)

    elements.append(PageBreak())
    text = ""
    for i, item in enumerate(dotlist, start=1):
        text += str(i) + ". " + item + "<br/>"
    
    elements.append(Paragraph(text, text_style))

    elements.append(Paragraph("Signature of the Electro Volt Technician", subheader_style))
    spacer = Spacer(1, 20)
    elements.append(spacer)
    
    file = doc.build(elements, onFirstPage=lambda canvas, doc: canvas_first_page(canvas, doc, header_style),
            onLaterPages=lambda canvas, doc: canvas_later_pages(canvas, doc))
    
# Define the styles for the header and footer
# Define the styles

info_style = ParagraphStyle(
    name='Info',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=12,
    leading=22,
    spaceBefore=10,
    spaceAfter=10,
    alignment= 2
)

header_style = ParagraphStyle(
    name='Header',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    spaceBefore=10,
    spaceAfter=10,
)

text_style = ParagraphStyle(
    name='Text',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=14,
    spaceBefore=0,
    spaceAfter=10,
)

subheader_style = ParagraphStyle(
    name='sub',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=14,
    spaceBefore=0,
    spaceAfter=10,
    allignment='left'
)

# Add the image

    
def canvas_first_page(canvas, doc,header_style):
    canvas.saveState()
    #canvas.setFont(footer_style.fontName, footer_style.fontSize)
    #canvas.drawString(36, 36, "First Page")
    header_style.fontSize = 18 # change font size
    header_style.textColor = HexColor('#FF0000') # change color to red
    canvas.drawString(36, 750, "Service Report: " + servicenumber)
    canvas.restoreState()

def canvas_later_pages(canvas, doc):
    canvas.saveState()

# Build the document
def return_pdf(data):
    process_data(data)
    file = createpdf()
    
    return file
