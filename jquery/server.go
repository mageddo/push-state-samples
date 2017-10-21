package main

import (
	"net/http"
	"log"
)

func main(){

	// mapeia uma pasta de estáticos
	http.Handle("/", http.FileServer(http.Dir("./")))

	http.HandleFunc("/page/", func(res http.ResponseWriter, req *http.Request){
		log.Println("m=page, path=", req.URL.Path)
		http.StripPrefix(req.URL.Path, http.FileServer(http.Dir("./"))).ServeHTTP(res, req)
	})
	log.Fatal(http.ListenAndServe(":3030", nil))
}

// 