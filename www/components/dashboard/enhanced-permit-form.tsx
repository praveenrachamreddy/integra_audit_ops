'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { permitApi, PermitAnalysisRequest, PermitAnalysisResponse } from '@/lib/api/permits';

interface PermitFormProps {
  onBack?: () => void;
}

export function EnhancedPermitForm({ onBack }: PermitFormProps) {
  const [formData, setFormData] = useState({
    projectDescription: '',
    location: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PermitAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectDescription.trim() || !formData.location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both project description and location.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const request: PermitAnalysisRequest = {
        project_description: formData.projectDescription,
        location: formData.location,
      };

      const result = await permitApi.analyzePermit(request);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your permit requirements have been analyzed successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze permit requirements';
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear analysis result when form changes
    if (analysisResult) {
      setAnalysisResult(null);
    }
  };

  const getTimelineColor = (timeline: string) => {
    if (timeline.includes('1-2') || timeline.includes('immediate')) {
      return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
    } else if (timeline.includes('3-4') || timeline.includes('week')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Permit Analysis
          </h2>
          <p className="text-muted-foreground mt-1">
            Get AI-powered permit requirements analysis for your project
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Describe your project and location to get personalized permit requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project-description">
                Project Description *
              </Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project in detail. For example: 'Building a 2-story residential addition with a new bathroom and kitchen extension'"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                className="min-h-[120px]"
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Project Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter city, state, or full address (e.g., San Francisco, CA)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10"
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Requirements...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyze Permit Requirements
                </>
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Project Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysisResult.project_summary).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-sm font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Documents you'll need to prepare for your permit application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.required_documents.map((doc, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{doc.document_type}</h4>
                      <Badge variant="secondary" className={getTimelineColor(doc.estimated_timeline)}>
                        {doc.estimated_timeline}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Requirements:</Label>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {doc.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Region-Specific Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Local Regulations
              </CardTitle>
              <CardDescription>
                Specific rules and requirements for your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.region_specific_rules.map((rule, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{rule.rule_type}</h4>
                      <Badge variant="outline">{rule.authority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Compliance Requirements:</Label>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {rule.compliance_requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pre-Submission Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Pre-Submission Checklist
              </CardTitle>
              <CardDescription>
                Final steps before submitting your permit application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.pre_submission_checklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="mt-1">
                      {item.required ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{item.item}</h4>
                        <Badge 
                          variant={item.required ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {item.required ? "Required" : "Optional"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.estimated_time}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Application
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Save Analysis
                </Button>
                <Button variant="outline" onClick={() => setAnalysisResult(null)}>
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 