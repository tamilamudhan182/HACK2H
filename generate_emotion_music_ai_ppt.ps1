$ErrorActionPreference = "Stop"

$outputPath = "E:\Emotion-Based_Music_AI_Presentation.pptx"

function Get-BodyTextRange {
    param([Parameter(Mandatory = $true)]$slide)

    for ($i = 1; $i -le $slide.Shapes.Count; $i++) {
        $shape = $slide.Shapes.Item($i)
        if ($shape.Type -eq 14 -and $shape.PlaceholderFormat.Type -eq 2) {
            return $shape.TextFrame.TextRange
        }
    }

    throw "Body placeholder not found."
}

function Add-Bullets {
    param(
        [Parameter(Mandatory = $true)]$slide,
        [Parameter(Mandatory = $true)][string[]]$lines
    )

    $body = Get-BodyTextRange -slide $slide
    $body.Text = ($lines -join "`r`n")
    $paragraphs = $body.Paragraphs()
    for ($i = 1; $i -le $paragraphs.Count; $i++) {
        $paragraph = $body.Paragraphs($i)
        $paragraph.ParagraphFormat.Bullet.Visible = -1
        $paragraph.Font.Size = 22
    }
}

function Set-Title {
    param(
        [Parameter(Mandatory = $true)]$slide,
        [Parameter(Mandatory = $true)][string]$title
    )

    $titleRange = $slide.Shapes.Title.TextFrame.TextRange
    $titleRange.Text = $title
    $titleRange.Font.Size = 28
    $titleRange.Font.Bold = -1
}

$pp = New-Object -ComObject PowerPoint.Application
$pp.Visible = -1
$presentation = $pp.Presentations.Add()

$ppLayoutTitle = 1
$ppLayoutText = 2
$ppLayoutBlank = 12
$msoShapeRoundedRectangle = 5
$msoShapeChevron = 52
$msoTrue = -1

# Slide 1
$slide = $presentation.Slides.Add(1, $ppLayoutTitle)
$slide.FollowMasterBackground = $msoTrue
$slide.Shapes.Title.TextFrame.TextRange.Text = "Emotion-Based Music AI"
$slide.Shapes.Item(2).TextFrame.TextRange.Text = "An emotion-aware web application that detects facial expressions and recommends mood-matching music in real time."
$slide.Shapes.Title.TextFrame.TextRange.Font.Size = 30
$slide.Shapes.Item(2).TextFrame.TextRange.Font.Size = 22

# Slide 2
$slide = $presentation.Slides.Add(2, $ppLayoutText)
Set-Title -slide $slide -title "Problem Statement"
Add-Bullets -slide $slide -lines @(
    "Traditional music recommendation systems depend on listening history, genre choices, or collaborative filtering."
    "These methods do not adapt to a user's changing emotional state in the moment."
    "A listener may feel joyful, calm, sad, or stressed at different times and needs music that responds instantly."
    "This project solves that gap with real-time, emotion-aware music recommendations driven by facial expressions."
)

# Slide 3
$slide = $presentation.Slides.Add(3, $ppLayoutText)
Set-Title -slide $slide -title "Solution Overview"
Add-Bullets -slide $slide -lines @(
    "The application is built with Flask and uses webcam input to detect the user's facial emotion."
    "Users first choose a preferred language and singer."
    "JavaScript captures an image and sends it to the backend as a base64 string."
    "OpenCV detects the face, a pre-trained deep learning model predicts the emotion, and the app returns YouTube and Spotify music links."
)

# Slide 4
$slide = $presentation.Slides.Add(4, $ppLayoutText)
Set-Title -slide $slide -title "User Flow"
Add-Bullets -slide $slide -lines @(
    "Step 1: User selects a language such as Tamil, Hindi, or English."
    "Step 2: User chooses a favorite singer."
    "Step 3: Webcam captures a facial image and sends it to the server."
    "Step 4: Backend predicts the emotion and maps it to a music genre."
    "Step 5: Personalized music links are generated and the session is saved to the history page."
)

# Slide 5
$slide = $presentation.Slides.Add(5, $ppLayoutText)
Set-Title -slide $slide -title "Tech Stack"
Add-Bullets -slide $slide -lines @(
    "Backend: Python and Flask"
    "AI Model: TensorFlow / Keras using model.h5"
    "Face Detection: OpenCV Haar Cascade classifier"
    "Database: SQLite with Flask-SQLAlchemy"
    "Frontend and Deployment: HTML, Jinja2, JavaScript, and Vercel"
)

# Slide 6
$slide = $presentation.Slides.Add(6, $ppLayoutText)
Set-Title -slide $slide -title "Emotion to Genre Mapping"
Add-Bullets -slide $slide -lines @(
    "Happiness -> Upbeat Pop"
    "Sadness -> Acoustic Melodies"
    "Anger -> Intense Rock"
    "Fear -> Ambient Sounds"
    "Surprise -> Energetic Electronic Music"
    "Neutral -> Chill Tunes"
)

# Slide 7
$slide = $presentation.Slides.Add(7, $ppLayoutBlank)
$titleBox = $slide.Shapes.AddTextbox(1, 24, 18, 650, 40)
$titleBox.TextFrame.TextRange.Text = "Architecture Diagram"
$titleBox.TextFrame.TextRange.Font.Size = 28
$titleBox.TextFrame.TextRange.Font.Bold = -1

$labels = @(
    @{ Text = "Browser UI`n(Language, Singer, Webcam)"; Left = 20; Top = 110; Width = 150; Height = 80; Fill = 15123099 },
    @{ Text = "Flask Backend"; Left = 205; Top = 110; Width = 120; Height = 80; Fill = 13431551 },
    @{ Text = "OpenCV`nFace Detection"; Left = 360; Top = 65; Width = 130; Height = 70; Fill = 14352383 },
    @{ Text = "Deep Learning Model`n(model.h5)"; Left = 360; Top = 155; Width = 130; Height = 70; Fill = 14352383 },
    @{ Text = "Genre Mapping"; Left = 525; Top = 65; Width = 120; Height = 70; Fill = 16772062 },
    @{ Text = "Music Links`n(YouTube / Spotify)"; Left = 525; Top = 155; Width = 120; Height = 70; Fill = 16772062 },
    @{ Text = "SQLite History"; Left = 680; Top = 110; Width = 120; Height = 80; Fill = 15527148 }
)

foreach ($item in $labels) {
    $shape = $slide.Shapes.AddShape($msoShapeRoundedRectangle, $item.Left, $item.Top, $item.Width, $item.Height)
    $shape.Fill.ForeColor.RGB = $item.Fill
    $shape.Line.ForeColor.RGB = 8421504
    $shape.TextFrame.TextRange.Text = $item.Text
    $shape.TextFrame.TextRange.Font.Size = 16
    $shape.TextFrame.TextRange.ParagraphFormat.Alignment = 2
    $shape.TextFrame.VerticalAnchor = 3
}

$arrows = @(
    @{ Left = 170; Top = 130; Width = 30; Height = 35 },
    @{ Left = 328; Top = 85; Width = 25; Height = 25 },
    @{ Left = 328; Top = 175; Width = 25; Height = 25 },
    @{ Left = 492; Top = 85; Width = 25; Height = 25 },
    @{ Left = 492; Top = 175; Width = 25; Height = 25 },
    @{ Left = 647; Top = 130; Width = 25; Height = 35 }
)

foreach ($arrow in $arrows) {
    $shape = $slide.Shapes.AddShape($msoShapeChevron, $arrow.Left, $arrow.Top, $arrow.Width, $arrow.Height)
    $shape.Fill.ForeColor.RGB = 10066329
    $shape.Line.Visible = 0
}

$caption = $slide.Shapes.AddTextbox(1, 35, 250, 735, 80)
$caption.TextFrame.TextRange.Text = "Flow: Webcam image -> Flask server -> Face detection -> Emotion prediction -> Genre mapping -> Music recommendation -> Session storage"
$caption.TextFrame.TextRange.Font.Size = 18
$caption.TextFrame.TextRange.Font.Italic = -1
$caption.TextFrame.TextRange.ParagraphFormat.Alignment = 2

# Slide 8
$slide = $presentation.Slides.Add(8, $ppLayoutText)
Set-Title -slide $slide -title "Demo Screens"
Add-Bullets -slide $slide -lines @(
    "Home screen for language selection"
    "Singer selection page with simple navigation"
    "Emotion detection screen showing the predicted mood"
    "Recommendation view with YouTube and Spotify links"
    "History page showing emotion, singer, language, and timestamp"
)

# Slide 9
$slide = $presentation.Slides.Add(9, $ppLayoutText)
Set-Title -slide $slide -title "Future Enhancements"
Add-Bullets -slide $slide -lines @(
    "Upgrade face detection using MediaPipe or Dlib for better accuracy."
    "Integrate the Spotify API for dynamic playlist creation."
    "Add a Mood Booster Mode to suggest uplifting songs during negative emotions."
    "Migrate from SQLite to PostgreSQL for improved scalability."
    "Visualize emotional trends with interactive analytics dashboards."
)

# Slide 10
$slide = $presentation.Slides.Add(10, $ppLayoutText)
Set-Title -slide $slide -title "References"
Add-Bullets -slide $slide -lines @(
    "More, P. B., et al. (2025). Emotion Based Music Recommendations. International Journal of Research Publication and Reviews, 6(3)."
    "Zala, R., et al. (2024). Emotion Based Music Recommendation using Machine Learning. JETIR, 11(4)."
    "Pardhi, P., et al. (2024). Emotion Based Music Recommendation System Using Machine Learning and AI. IJTSRD, 8(5)."
)

foreach ($s in $presentation.Slides) {
    foreach ($i in 1..$s.Shapes.Count) {
        $shape = $s.Shapes.Item($i)
        if ($shape.HasTextFrame -eq $msoTrue) {
            $shape.TextFrame.TextRange.Font.Name = "Aptos"
        }
    }
}

$presentation.SaveAs($outputPath)
$presentation.Close()
$pp.Quit()

Write-Output "Created: $outputPath"

