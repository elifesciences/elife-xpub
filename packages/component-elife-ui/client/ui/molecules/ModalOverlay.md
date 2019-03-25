A full screen modal overlay

    initialState = {open: false};

    <div>
        <button onClick={() => setState({ open: true })}>Open</button>

        <ModalOverlay open={state.open}>
            <button onClick={() => setState({ open: false })}>Close</button>
            {Array.from(Array(30), (x, i) => <p>Paragraph {i}</p>)}
        </ModalOverlay>
    </div>
