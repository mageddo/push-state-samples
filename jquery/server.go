package main

import (
	"net/http"
	"log"
)

func main(){

	http.Handle("/data/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("m=/data")
		w.Header().Set("Access-Control-Allow-Origin", "*") // allow all domains query me
		http.StripPrefix("/data", http.FileServer(http.Dir("./data"))).ServeHTTP(w, r)
	}))

	http.Handle("/", http.FileServer(http.Dir("./")))

	// all pages will load content from the root static directory. Then onpopstate will take care of 
	// load the respective page content
	http.HandleFunc("/page/", func(res http.ResponseWriter, req *http.Request){
		log.Println("m=page, path=", req.URL.Path)
		http.StripPrefix(req.URL.Path, http.FileServer(http.Dir("./"))).ServeHTTP(res, req)
	})


	log.Fatal(http.ListenAndServe(":3030", nil))
}