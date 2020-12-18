const Style = () => <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Langar&display=swap');

    .body {
        margin: 0;
        padding: 0;
    }

    .wrapper {
        display: flex;
        width: 100%;
        height: 100vh;
        justify-content: center;
        align-items: center;
    }

    .langar {
        font-family: 'Langar';
        font-size: 64px;
    }
` }} />

export default ({ query }) => <html>
    <head>
        <Style />
    </head>
    <body>
        <div className="wrapper">
            <div className="langar">{ query.title || 'Hello' }</div>
            <div>generated from tsx</div>
        </div>
    </body>
</html>
