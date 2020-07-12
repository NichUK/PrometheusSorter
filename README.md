# PrometheusSorter

This little Node/Express app attempts to bridge the annoying gap
between Prometheus who believe that sorting should be the domain
of the display layer, and Grafana who believe that sorting should
be done by the data layer.

Maybe one day of them will JFDI and this app will can be retired for good!

Usage:

node app.js http://prometheus.url/api/v1

then add:

orderby(label) to sort alphabetically or 
orderby(num(label)) to sort numerically to the end of a Prometheus query


Use or abuse this application for whatever purposes you like, business or
pleasure, but any problems you may encounter are entirely your own problem.

Pull requests welcome if you find a problem, or have a cool extension or deployment.

Nich
nich@nixnet.com
