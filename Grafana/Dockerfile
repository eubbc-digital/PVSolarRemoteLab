FROM grafana/grafana:9.4.14-ubuntu

# Install plugins here our in your own config file
# ENV GF_INSTALL_PLUGINS="<list of plugins seperated by ,"

# Add dashboard json files
ADD ./dashboards /etc/grafana/dashboards
# Add configuration file
ADD ./grafana.ini /etc/grafana/grafana.ini
# Add provisioning
ADD ./provisioning /etc/grafana/provisioning
