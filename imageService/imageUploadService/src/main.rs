use std::{
    fs,
    io::{prelude::*, BufReader},
    net::{TcpListener, TcpStream},
};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:9999").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&mut stream);
    let _request_line = buf_reader.lines().next().unwrap().unwrap();
    if _request_line == "GET / HTTP/1.1" {
        let _status_line = "HTTP/1.1 200 OK";
        let response = "HTTP/1.1 200 OK\r\n\r\n";
        stream.write_all(response.as_bytes()).unwrap();
    } else {
        let _status_line = "HTTP/1.1 404 NOT FOUND";
        let response = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
        stream.write_all(response.as_bytes()).unwrap();
    }  
}